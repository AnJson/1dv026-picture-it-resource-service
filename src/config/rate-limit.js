/**
 * Rate-limit configuration.
 *
 * @author Anders Jonsson
 * @version 1.0.0
 */

import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
  message: 'Exceeded request limit, please try again later.'
})
