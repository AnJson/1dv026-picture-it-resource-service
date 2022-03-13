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
   * Format the raw resource-object.
   *
   * @param {object} resource - Document from db.
   * @returns {object} - Formatted object.
   */
  #toSafeObject (resource) {
    return {
      imageUrl: resource.imageUrl,
      description: resource.description,
      contentType: resource.contentType,
      updatedAt: resource.updatedAt,
      createdAt: resource.createdAt,
      id: resource.id
    }
  }

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
      const { fields, sort, skip, limit, page, ...filter } = req.query

      // Set up query with filters, sorting and pagination.
      const query = Resource
        .find({
          author: req.user.id,
          ...filter
        })
        .select(fields)
        .sort(sort ? sort.split(',').join(' ') : '-createdAt')
        .skip(skip)
        .limit(limit)

      // Execute the query.
      const images = await query

      res
        .status(200)
        .json(images.map(image => this.#toSafeObject(image)))
    } catch (error) {
      next(error)
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
      const response = await this.#postToImageService(process.env.IMAGE_SERVICE_BASE_URL,
        {
          data: req.body.data,
          contentType: req.body.contentType
        })

      const { imageUrl, id: imageId } = await response.json()

      // Save image-data
      const image = new Resource({
        imageUrl,
        description: req.body.description,
        contentType: req.body.contentType,
        author: req.user.id,
        resourceId: imageId
      })

      const savedData = await image.save()

      res
        .status(201)
        .json(this.#toSafeObject(savedData))
    } catch (error) {
      let err = error

      // Validation error(s).
      if (err.name === 'ValidationError') {
        err = createError(400)
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
      res
        .status(200)
        .json(this.#toSafeObject(req.imageResource))
    } catch (error) {
      next(error)
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
  async imagePut (req, res, next) {
    try {
      // NOTE: Not validating data for image-service as image-service should be responsible for that validation.

      const requests = [
        await this.#postToImageService(`${process.env.IMAGE_SERVICE_BASE_URL}/${req.imageResource.resourceId}`,
          {
            data: req.body.data,
            contentType: req.body.contentType
          }, 'PUT'),
        await Resource.findByIdAndUpdate(req.imageResource.id, req.body, { runValidators: true })
      ]

      await Promise.all(requests)

      res
        .status(204)
        .end()
    } catch (error) {
      let err = error

      // Validation error(s).
      if (err.name === 'ValidationError') {
        err = createError(400)
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
  async imagePatch (req, res, next) {
    try {
      // NOTE: Not validating data for image-service as image-service should be responsible for that validation.

      const requests = [
        await this.#postToImageService(`${process.env.IMAGE_SERVICE_BASE_URL}/${req.imageResource.resourceId}`, req.body, 'PATCH'),
        await Resource.findByIdAndUpdate(req.imageResource.id, req.body, { runValidators: true })
      ]

      await Promise.all(requests)

      res
        .status(204)
        .end()
    } catch (error) {
      let err = error

      // Validation error(s).
      if (err.name === 'ValidationError') {
        err = createError(400)
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
  async imageDelete (req, res, next) {
    try {
      const requests = [
        await this.#postToImageService(`${process.env.IMAGE_SERVICE_BASE_URL}/${req.imageResource.resourceId}`, {}, 'DELETE'),
        await Resource.findByIdAndDelete(req.imageResource.id)
      ]

      await Promise.all(requests)

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
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
        const err = createError(404)

        next(err)
        return
      }

      // Resource found but user is not authorized.
      if (imageData.author !== req.user.id) {
        const err = createError(403)

        next(err)
        return
      }

      // Save resource in request-object.
      req.imageResource = imageData

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
      const error = createError(401)
      error.cause = err
      next(error)
    }
  }

  /**
   * Send authorized post/put/patch-request to image-service.
   *
   * @param {string} url - The url to send the request to.
   * @param {object} data - Request-body object.
   * @param {string} method - Request-type (POST, PUT, PATCH).
   * @returns {Promise} - For response-object.
   */
  async #postToImageService (url, data, method = 'POST') {
    return fetch(url, {
      method,
      headers: {
        'X-API-Private-Token': process.env.ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
}
