import db from '../db'
import { addFragmentToInfo } from 'graphql-binding'

export const ADMIN = 'ADMIN'
export const MANAGER = 'MANAGER'
export const EDITOR = 'EDITOR'
export const WRITER = 'WRITER'

export const getUser = ({ req = {}, request = {} }) =>
  req.user || request.user || null

export const hasRole = (ctx, roles) => {
  const { role = '' } = getUser(ctx) || {}
  return role && roles.includes(role)
}

const EXTEND_USER_FRAGMENT = `fragment ExtendUser on User { id firstName lastName }`
const extendInfo = info =>
  info ? addFragmentToInfo(info, EXTEND_USER_FRAGMENT) : info
const getInfo = ({ info } = {}) => extendInfo(info)

/**
 *
 * @description Finds a User in DB
 * @param {Object} query
 * @param {Object} query.where
 * @param {Object} options
 * @returns {Promise<Object>} User object from DB
 */
export function findUser({ where = {} }, options) {
  return db.query.user({ where }, getInfo(options))
}

/**
 *
 * @description Creates a new User in DB
 * @param {Object} mutation
 * @param {Object} mutation.data
 * @param {Object} options
 * @returns {Promise<Object>} User object from DB
 */
export function createUser({ data = {} }, options) {
  return db.mutation.createUser({ data }, getInfo(options))
}

/**
 *
 * @description Deletes a User from DB
 * @param {Object} query
 * @param {Object} query.where
 * @param {Object} options
 * @returns {Promise<Object>} User object from DB
 */
export function deleteUser({ where = {} }, options) {
  return db.mutation.deleteUser({ where }, getInfo(options))
}
