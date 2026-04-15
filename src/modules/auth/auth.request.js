import Joi from "joi";

// Registration DTO schema - ONLY ESSENTIAL FIELDS
const userRegistrationDTO = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required.'
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is required.'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password is required.'
  }),
  passwordConfirmation: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Password and confirmation must match.',
    'any.required': 'Password confirmation is required.'
  }),
  phone: Joi.string().optional().allow(''),
  address: Joi.object({
    street: Joi.string().required().messages({
      'string.empty': 'Street is required.'
    }),
    postalCode: Joi.string().required().messages({
      'string.empty': 'Postal code is required.'
    })
  }).required(),
  role: Joi.string().valid('admin', 'customer').default('customer')
});

// Login DTO schema
const loginDTO = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is required.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.'
  })
});

const activationDTO = Joi.object({
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 characters.',
    'any.required': 'OTP is required.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is required.'
  })
});

const resendOtpDTO = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'string.empty': 'Email is required.'
  })
});


const updateProfileDTO = Joi.object({
  firstName: Joi.string().optional().messages({
    'string.empty': 'First name cannot be empty.'
  }),
  lastName: Joi.string().optional().messages({
    'string.empty': 'Last name cannot be empty.'
  }),
  phone: Joi.string().optional().allow(''),
  address: Joi.object({
    country: Joi.string().optional(),
    company: Joi.string().optional().allow(''),
    street: Joi.string().optional(),
    additional: Joi.string().optional().allow(''),
    postalCode: Joi.string().optional(),
    city: Joi.string().optional().allow('')
  }).optional(),
  billingAddress: Joi.object({
    firstName: Joi.string().optional().allow(''),
    lastName: Joi.string().optional().allow(''),
    country: Joi.string().optional(),
    company: Joi.string().optional().allow(''),
    street: Joi.string().optional().allow(''),
    additional: Joi.string().optional().allow(''),
    postalCode: Joi.string().optional().allow(''),
    city: Joi.string().optional().allow('')
  }).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.'
});

const changePasswordDTO = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'Current password is required.'
    }),
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'New password must be at least 8 characters long.',
        'string.empty': 'New password is required.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords must match.',
        'any.required': 'Password confirmation is required.'
    })
});


export { userRegistrationDTO, loginDTO, activationDTO, resendOtpDTO, updateProfileDTO, changePasswordDTO };