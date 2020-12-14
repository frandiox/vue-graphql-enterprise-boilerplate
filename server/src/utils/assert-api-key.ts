import { IncomingHttpHeaders } from 'http2'
import { ForbiddenError } from '../errors'

export default function assertAPIKey(headers: IncomingHttpHeaders) {
  if (headers['x-api-key'] !== process.env.API_KEY) {
    throw new ForbiddenError(`API key is not valid`)
  }
}
