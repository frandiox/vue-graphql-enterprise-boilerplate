import { authDirectives } from './auth'
import { constraintDirectives } from './constraint'

export const schemaDirectives = {
  ...authDirectives,
  ...constraintDirectives,
}
