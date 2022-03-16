/**
 * The routes.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as imageRouter } from './images-router.js'
import { documentation } from '../documentation/documentation.js'

export const router = express.Router()

router.get('/', (req, res) => res.json(documentation))
router.use('/images', imageRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
