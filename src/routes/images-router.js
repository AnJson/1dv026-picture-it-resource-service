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

// Get all images.
router.get('/', /*authenticate*/ /*authorize*/ (req, res, next) => controller.index(req, res, next))

// Upload image.
router.post('/', /*authenticate*/ (req, res, next) => controller.register(req, res, next))
