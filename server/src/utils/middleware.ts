import {
  ApolloServer,
  Config,
  CreateHandlerOptions,
} from 'apollo-server-cloud-functions'
import {
  ActionHandler,
  EventHandler,
  Request,
  Response,
  RestHandler,
  UnknownPayload,
} from '../@types/http'
import { logger } from '../services/logger'
import assertAPIKey from './assert-api-key'

type RequestResult = {
  message: string
  status: number
  name?: string // For error codes
  data?: UnknownPayload | null
}

type ResponseOptions = {
  type?: 'rest' | 'action' | 'event' | 'webhook'
  assertHeaders?: (headers: Request['headers']) => void
}

function handleResponse(
  res: Response,
  { status = 500, message = 'error', name, data = null }: RequestResult,
  { type }: ResponseOptions = {}
) {
  let payload
  try {
    if (status >= 400) {
      payload = JSON.stringify({
        message,
        status,
        data,
        code: data?.code || name,
      })
    } else {
      payload = JSON.stringify(
        ['action', 'rest'].includes(type as string)
          ? data
          : { message, status, data }
      )
    }
  } catch {
    payload = `{"message":${message},"status":500}`
  }

  return res
    .header({ 'content-type': 'application/json' })
    .status(status)
    .send(payload)
}

export function restAdapter(
  handler: RestHandler,
  { type = 'rest', assertHeaders = () => null }: ResponseOptions = {}
) {
  return async function (req: Request, res: Response) {
    try {
      assertHeaders(req.headers)

      const result = await handler(req.body || req.query, req)

      handleResponse(
        res,
        {
          data: null,
          status: 200,
          message: 'ok',
          ...(result || {}),
        },
        { type }
      )
    } catch (error) {
      const errorType = error.data?.fatal ? 'fatal' : 'error'

      logger[errorType](
        `Error in API: ${error.message}`,
        {
          error,
          request: {
            body: req.body || req.query,
            headers: req.headers,
          },
        },
        { type }
      )

      handleResponse(res, error)
    }
  }
}

export function actionAdapter(handler: ActionHandler) {
  return restAdapter(handler, {
    type: 'action',
    assertHeaders: assertAPIKey,
  })
}

export function eventAdapter(handler: EventHandler) {
  return restAdapter(handler, {
    type: 'event',
    assertHeaders: assertAPIKey,
  })
}

export function webhookAdapter(
  handler: RestHandler,
  { assertHeaders }: Pick<ResponseOptions, 'assertHeaders'> = {}
) {
  return restAdapter(handler, { type: 'webhook', assertHeaders })
}

export function schemaAdapter(
  setup: () => Config & { options?: CreateHandlerOptions }
) {
  const { options = {}, ...serverOptions } = setup()

  const server = new ApolloServer({
    playground: process.env.NODE_ENV !== 'production',
    introspection: true,
    context: ({ req, res }) => {
      assertAPIKey(req.headers)

      return {
        headers: req.headers,
        req,
        res,
      }
    },
    ...serverOptions,
    resolvers: serverOptions.resolvers
  })

  return server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    },
    ...options,
  })
}
