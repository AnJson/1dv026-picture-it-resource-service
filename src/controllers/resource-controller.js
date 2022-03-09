/**
 * The ResourceController.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { Resource } from '../models/resource.js'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * Json-response with an array of users images.
   * (GET /images).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      console.log('You are in!')
      console.log(req.user)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Save image to image-service and image-data to db.
   * (POST /images).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      console.log('You are POSTING!')
      console.log(req.user)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Return single image as json.
   * (GET /images/:id).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async image (req, res, next) {
    try {
      console.log('You are getting a single image!')
      console.log(req.user)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Authorize user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - Resource id.
   */
  async authorize (req, res, next, id) {
    try {
      console.log(id)
      console.log('authorizing --------------')
      const imageData = await Resource.findById(id)
      // TODO: Fix!!
      console.log(imageData)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Authenticates requests.
   *
   * If authentication is successful, `req.user`is populated and the
   * request is authorized to continue.
   * If authentication fails, an unauthorized response will be sent.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticateJWT = (req, res, next) => {
    try {
      const [authenticationScheme, token] = req.headers.authorization?.split(' ')

      if (authenticationScheme !== 'Bearer') {
        throw new Error('Invalid authentication scheme.')
      }

      const payload = jwt.verify(token, Buffer.from(process.env.ACCESS_TOKEN_SECRET, 'base64'))
      req.user = {
        id: payload.sub,
        permissionLevel: payload.x_permission_level
      }

      next()
    } catch (err) {
      const error = createError(401)
      error.cause = err
      next(error)
    }
  }
}
