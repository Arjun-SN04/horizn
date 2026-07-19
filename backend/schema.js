const Joi = require('joi');

module.exports.listingschema = Joi.object({
  lististing: Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().allow('', null),
    image:       Joi.string().allow('', null),
    price:       Joi.number().required().min(0),
    location:    Joi.string().required(),
    country:     Joi.string().required(),
    guests:      Joi.number().integer().min(1).default(1),
    bedrooms:    Joi.number().integer().min(1).default(1),
    bathrooms:   Joi.number().min(0.5).default(1),
    amenities:   Joi.array().items(Joi.string()).default([]),
    images:      Joi.array().items(Joi.string()).default([]),
  }).required(),
  removeImages: Joi.string().allow('', null),
});

module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    checkIn:  Joi.date().required().messages({ 'any.required': 'Check-in date is required' }),
    checkOut: Joi.date().required().greater(Joi.ref('checkIn')).messages({
      'any.required':    'Check-out date is required',
      'date.greater':    'Check-out must be after check-in',
    }),
    guests: Joi.number().integer().min(1).required().messages({
      'number.min': 'At least 1 guest is required',
    }),
  }).required(),
});

module.exports.reportSchema = Joi.object({
  report: Joi.object({
    reason:  Joi.string().valid('inaccurate', 'inappropriate', 'spam', 'scam', 'other').required(),
    details: Joi.string().allow('', null).max(1000),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating:   Joi.number().required().min(1).max(5),
    comment:  Joi.string().required(),
    createAt: Joi.date().default(Date.now).allow(null, ''),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required().min(3).max(30).messages({
      'string.empty': 'Username is required',
      'string.min':   'Username must be at least 3 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be valid',
    }),
    password: Joi.string().required().min(6).max(30).messages({
      'string.empty': 'Password is required',
      'string.min':   'Password must be at least 6 characters',
    }),
  }).required(),
});
