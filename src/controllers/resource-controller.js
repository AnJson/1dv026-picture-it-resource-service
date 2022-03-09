/**
 * The ResourceController.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { Resource } from '../models/resource.js'
import { isJWT } from validator

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * (GET /images)
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }

  /**
   * (POST /images)
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }

  /**
   * Authorize user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
   async authorize (req, res, next) {
    try {
      // isJWT(str)
    } catch (error) {
      
    }
  }
}
