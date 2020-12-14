import { Request as ExpressRequest, Response as ExpressResponse } from 'express'

export type UnknownPayload = any

export type Response = ExpressResponse

export interface Request extends ExpressRequest {
  rawBody: Buffer
}

export declare type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH'

export declare type ResponsePayload = {
  data?: UnknownPayload
  status?: number
  message?: string
}

export declare type RestHandler<T = Request['body'] | Request['query']> = {
  (
    payload: T,
    meta: Omit<Request, 'body' | 'query'>
  ): Promise<ResponsePayload | void>
}

export type EventPayload = {
  id: string
  createdAt: string
  event: {
    sessionVariables: { [key: string]: string } | null
    op: 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL'
    data: {
      old: UnknownPayload
      new: UnknownPayload
    }
  }
  deliveryInfo: {
    maxRetries: number
    currentRetry: number
  }
  trigger: {
    name: string
  }
  table: {
    schema: string
    name: string
  }
}

export type EventHandler = RestHandler<EventPayload>

export declare type ActionPayload = {
  sessionVariables: {
    xHasuraUserId: string
    xHasuraRole: string
  }
  input: UnknownPayload
  action: { name: string }
}

export type ActionHandler = RestHandler<ActionPayload>
