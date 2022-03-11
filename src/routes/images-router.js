/**
 * Images-routes.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import express from 'express'
import { ResourceController } from '../controllers/resource-controller.js'

export const router = express.Router()

const controller = new ResourceController()

// Block user from all routes if not valid JWT.
router.all('*', controller.authenticateJWT)

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
router.delete('/:id', (req, res, next) => controller.imagePatch(req, res, next))
