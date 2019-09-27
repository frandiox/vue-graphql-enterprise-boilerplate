import { importSchema } from 'graphql-import'
import path from 'path'

// API typeDefs
export const typeDefs = importSchema(path.join(__dirname, './main.graphql'))
