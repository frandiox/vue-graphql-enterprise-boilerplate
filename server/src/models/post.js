import db from '../db'

const getInfo = ({ info } = {}) => info

/**
 *
 * @description Finds a Post in DB
 * @param {Object} query
 * @param {Object} query.where
 * @param {Object} options
 * @returns {Promise<Object>} Post object from DB
 */
export function findPost({ where = {} }, options) {
  return db.query.post({ where }, getInfo(options))
}

/**
 *
 * @description Finds a list of Posts in DB
 * @param {Object} query
 * @param {Object} query.where
 * @param {Object} query.first
 * @param {Object} query.orderBy
 * @param {Object} options
 * @returns {Promise<[Object]>} List of public Post objects from DB
 */
export function findPostList(query, options) {
  return db.query.posts(query, getInfo(options))
}

/**
 *
 * @description Updates a Post in DB
 * @param {Object} params
 * @param {Object} params.where
 * @param {Object} params.data
 * @param {Object} options
 * @returns {Promise<Object>} Post object from DB
 */
export function updatePost({ where = {}, data = {} }, options) {
  return db.mutation.updatePost({ where, data }, getInfo(options))
}

/**
 *
 * @description Creates a new Post in DB
 * @param {Object} mutation
 * @param {Object} mutation.data
 * @param {Object} options
 * @returns {Promise<Object>} Post object from DB
 */
export function createPost({ data = {} }, options) {
  return db.mutation.createPost({ data }, getInfo(options))
}

/**
 *
 * @description Deletes a Post from DB
 * @param {Object} query
 * @param {Object} query.where
 * @param {Object} options
 * @returns {Promise<Object>} Post object from DB
 */
export function deletePost({ where = {} }, options) {
  return db.mutation.deletePost({ where }, getInfo(options))
}

/**
 *
 * @description Check if the given user is the owner of a Post
 * @param {Object} query
 * @param {Object} query.where
 * @param {Object} options
 * @returns {Promise<Boolean>} Whether Post exists and user is owner
 */
export function isPostOwner({ id } = {}, postId) {
  return id
    ? db.exists.Post({
        id: postId,
        author: { id },
      })
    : false
}
