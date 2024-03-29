/**
 * Mongoose model Resource.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import validator from 'validator'

const { isURL } = validator

// Create a schema.
const schema = new mongoose.Schema({
  imageUrl: {
    type: String,
    validate: [isURL, 'Data is required to generate a valid image-url.'],
    trim: true,
    immutable: true,
    required: true
  },
  description: {
    type: String,
    minLength: [1, 'The description must be of minimum length 1 characters.'],
    maxLength: [500, 'The description must be of maximum length 500 characters.'],
    trim: true
  },
  contentType: {
    type: String,
    enum: {
      values: ['image/gif', 'image/jpeg', 'image/png'],
      message: 'Please provide a valid mime-type.'
    },
    trim: true,
    required: true
  },
  author: {
    type: String,
    trim: true,
    immutable: true,
    required: true
  },
  resourceId: {
    type: String,
    trim: true,
    immutable: true,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    },
    virtuals: true // ensure virtual fields are serialized
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Resource = mongoose.model('Resource', schema)
