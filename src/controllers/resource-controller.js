/**
 * The ResourceController.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
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
      // POST to image-service
      const { imageUrl, id: imageId } = await this.#postToImageService({
        data: req.body.data,
        contentType: req.body.contentType
      })

      console.log(imageUrl)

      const image = new Resource({
        imageUrl,
        contentType: req.body.contentType,
        description: req.body.description,
        author: req.user.id,
        resourceId: imageId
      })

      const savedData = await image.save()

      // TODO: Check the return-value and return json to client.
      console.log(savedData)
      res
        .status(201)
        .json(savedData.toJSON())

      next() // REMOVE
    } catch (error) {
      let err = error

      // Validation error(s).
      if (err.name === 'ValidationError') {
        err = createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).')
        err.cause = error
      }

      next(err)
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
      res.end()
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
      const imageData = await Resource.findById(id)

      // No resource found.
      if (!imageData) {
        const err = createError(404, 'The requested resource was not found.')

        next(err)
        return
      }

      // Resource found but user is not authorized.
      if (imageData.author !== req.user.id) {
        const err = createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.')

        next(err)
        return
      }

      // Save resource in request-object.
      req.image = imageData

      next()
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
      const error = createError(401, 'Access token invalid or not provided.')
      error.cause = err
      next(error)
    }
  }

  /**
   * Send authorized post/put/patch-request to image-service.
   *
   * @param {object} data - Request-body object.
   * @param {object} method - Request-type (POST, PUT, PATCH).
   * @returns {Promise} - For json-parsed response.
   */
  async #postToImageService (data, method = 'POST') {
    const response = await fetch(process.env.IMAGE_SERVICE_BASE_URL, {
      method,
      headers: {
        'X-API-Private-Token': process.env.ACCESS_TOKEN
      },
      body: JSON.stringify(data)
    })

    console.log(response) // NOTE: REMOVE!

    return response.json()
  }
}
