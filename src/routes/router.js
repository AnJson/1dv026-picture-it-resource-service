/**
 * The routes.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import express from 'express'
import { readFile } from 'fs/promises'
import createError from 'http-errors'
import { router as imageRouter } from './images-router.js'

/**
 * Read from json-file.
 *
 * @param {string} path - The realative path to json-document.
 * @returns {object} - Documentation object.
 */
const getDocumentation = async (path) => {
  let docs
  try {
    const textFromFile = await readFile(path, 'utf8')
    docs = JSON.parse(textFromFile, 2)
  } catch (error) {
    docs = {
      message: 'Welcome to the resource-service! Use the /images endpoint to handle resources.'
    }
  }

  return docs
}

const documentation = await getDocumentation('./data/docs.json')

export const router = express.Router()

router.get('/', (req, res) => res.json(documentation))
router.use('/images', imageRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
