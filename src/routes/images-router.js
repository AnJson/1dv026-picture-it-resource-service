/**
 * Images-routes.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import express from 'express'
import { ImageController } from '../controllers/images-controller.js'
import { rateLimiter } from '../config/rate-limit.js'

export const router = express.Router()

const controller = new ImageController()

// Block user from all routes if not valid JWT.
// Implement rate-limit on all routes on this router.
router.all('*', controller.authenticateJWT, rateLimiter)

// Authorize user for single resource.
router.param('id', controller.authorize)

// Get all images.
router.get('/', (req, res, next) => controller.index(req, res, next))

// Upload image.
router.post('/', (req, res, next) => controller.indexPost(req, res, next))

// Get single image.
router.get('/:id', (req, res, next) => controller.image(req, res, next))

// Total update of image.
router.put('/:id', (req, res, next) => controller.imagePut(req, res, next))

// Partial update of image.
router.patch('/:id', (req, res, next) => controller.imagePatch(req, res, next))

// Delete image.
router.delete('/:id', (req, res, next) => controller.imageDelete(req, res, next))
