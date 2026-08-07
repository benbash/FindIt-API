const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isBoolean = (value) => typeof value === 'boolean';

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const isArrayOfStrings = (value) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const runValidation = (validator) => (req, _res, next) => {
  const errors = validator(req);

  if (errors.length > 0) {
    return next(new AppError('Request validation failed', 400, errors));
  }

  return next();
};

const validateLocation = (location, label = 'location') => {
  const errors = [];

  if (!isPlainObject(location)) {
    return [`${label} must be an object`];
  }

  ['description', 'city', 'state', 'landmark'].forEach((field) => {
    if (location[field] !== undefined && !isNonEmptyString(location[field])) {
      errors.push(`${label}.${field} must be a non-empty string`);
    }
  });

  if (location.country !== undefined && !isNonEmptyString(location.country)) {
    errors.push(`${label}.country must be a non-empty string`);
  }

  ['lat', 'lng'].forEach((field) => {
    if (location[field] !== undefined && !isNumber(location[field])) {
      errors.push(`${label}.${field} must be a valid number`);
    }
  });

  return errors;
};

const validateImageUrls = (images, label = 'images') => {
  if (!Array.isArray(images)) {
    return [`${label} must be an array`];
  }

  const errors = [];

  images.forEach((image, index) => {
    if (!isNonEmptyString(image)) {
      errors.push(`${label}[${index}] must be a non-empty string`);
    }
  });

  return errors;
};

const validateDateString = (value, fieldName, required = false) => {
  const errors = [];

  if (value === undefined || value === null || value === '') {
    if (required) {
      errors.push(`${fieldName} is required`);
    }
    return errors;
  }

  if (Number.isNaN(Date.parse(value))) {
    errors.push(`${fieldName} must be a valid date string`);
  }

  return errors;
};

const validateStatus = (value, allowedValues, fieldName) => {
  if (value !== undefined && !allowedValues.includes(value)) {
    return [`${fieldName} must be one of ${allowedValues.join(', ')}`];
  }

  return [];
};

exports.validateObjectIdParam = (paramName) =>
  runValidation((req) => {
    if (!isValidObjectId(req.params[paramName])) {
      return [`${paramName} must be a valid MongoDB ObjectId`];
    }

    return [];
  });

exports.validateRegister = runValidation((req) => {
  const body = req.body;
  const errors = [];

  if (!isNonEmptyString(body.fullName)) {
    errors.push('fullName is required');
  }

  if (!isNonEmptyString(body.email)) {
    errors.push('email is required');
  }

  if (!isNonEmptyString(body.password) || body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }

  if (!isNonEmptyString(body.phoneNumber)) {
    errors.push('phoneNumber is required');
  }

  if (!isNonEmptyString(body.state)) {
    errors.push('state is required');
  }

  if (!isNonEmptyString(body.lga)) {
    errors.push('lga is required');
  }

  errors.push(
    ...validateStatus(body.role, ['user', 'admin', 'customer', 'vendor', 'rider'], 'role')
  );

  return errors;
});

exports.validateLogin = runValidation((req) => {
  const body = req.body;
  const errors = [];

  if (!isNonEmptyString(body.email)) {
    errors.push('email is required');
  }

  if (!isNonEmptyString(body.password)) {
    errors.push('password is required');
  }

  return errors;
});

exports.validateForgotPassword = runValidation((req) => {
  const errors = [];

  if (!isNonEmptyString(req.body.email)) {
    errors.push('email is required');
  }

  return errors;
});

exports.validateResetPassword = runValidation((req) => {
  const errors = [];

  if (!isNonEmptyString(req.body.password) || req.body.password.length < 6) {
    errors.push('password is required and must be at least 6 characters');
  }

  return errors;
});

exports.validateProfileUpdate = runValidation((req) => {
  const body = req.body;
  const errors = [];

  ['fullName', 'name', 'phoneNumber', 'state', 'lga'].forEach((field) => {
    if (body[field] !== undefined && !isNonEmptyString(body[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  });

  if (body.email !== undefined && !isNonEmptyString(body.email)) {
    errors.push('email must be a non-empty string');
  }

  if (body.role !== undefined) {
    errors.push(
      ...validateStatus(body.role, ['user', 'admin', 'customer', 'vendor', 'rider'], 'role')
    );
  }

  return errors;
});

const validateItemBody = (body, mode = 'create') => {
  const errors = [];
  const required = mode === 'create';

  if ((required || body.title !== undefined) && !isNonEmptyString(body.title)) {
    errors.push('title is required');
  }

  if ((required || body.description !== undefined) && !isNonEmptyString(body.description)) {
    errors.push('description is required');
  }

  if ((required || body.category !== undefined) && !isNonEmptyString(body.category)) {
    errors.push('category is required');
  }

  if ((required || body.contactPhone !== undefined) && !isNonEmptyString(body.contactPhone)) {
    errors.push('contactPhone is required');
  }

  if (body.location !== undefined || required) {
    errors.push(...validateLocation(body.location, 'location'));
  }

  if (body.images !== undefined) {
    errors.push(...validateImageUrls(body.images));
  }

  if (body.tags !== undefined && !isArrayOfStrings(body.tags)) {
    errors.push('tags must be an array of strings');
  }

  if (body.rewardAmount !== undefined && (!isNumber(body.rewardAmount) || body.rewardAmount < 0)) {
    errors.push('rewardAmount must be a non-negative number');
  }

  if (body.isAnonymous !== undefined && !isBoolean(body.isAnonymous)) {
    errors.push('isAnonymous must be a boolean');
  }

  return errors;
};

exports.validateLostItemCreate = runValidation((req) => {
  const errors = validateItemBody(req.body, 'create');
  errors.push(...validateDateString(req.body.dateLost, 'dateLost', true));
  errors.push(
    ...validateStatus(req.body.status, ['open', 'matched', 'recovered', 'closed'], 'status')
  );
  return errors;
});

exports.validateLostItemUpdate = runValidation((req) => {
  const errors = validateItemBody(req.body, 'update');
  errors.push(...validateDateString(req.body.dateLost, 'dateLost'));
  errors.push(
    ...validateStatus(req.body.status, ['open', 'matched', 'recovered', 'closed'], 'status')
  );
  return errors;
});

exports.validateFoundItemCreate = runValidation((req) => {
  const errors = validateItemBody(req.body, 'create');
  errors.push(...validateDateString(req.body.dateFound, 'dateFound', true));
  errors.push(
    ...validateStatus(req.body.status, ['open', 'claimed', 'returned', 'closed'], 'status')
  );
  return errors;
});

exports.validateFoundItemUpdate = runValidation((req) => {
  const errors = validateItemBody(req.body, 'update');
  errors.push(...validateDateString(req.body.dateFound, 'dateFound'));
  errors.push(
    ...validateStatus(req.body.status, ['open', 'claimed', 'returned', 'closed'], 'status')
  );
  return errors;
});

exports.validateItemSearchQuery = runValidation((req) => {
  const errors = [];
  const { status, type, fromDate, toDate, limit, page } = req.query;

  if (status !== undefined && !['open', 'matched', 'recovered', 'claimed', 'returned', 'closed'].includes(status)) {
    errors.push('status must be a supported item status');
  }

  if (type !== undefined && !['lost', 'found', 'all'].includes(type)) {
    errors.push('type must be one of lost, found, all');
  }

  errors.push(...validateDateString(fromDate, 'fromDate'));
  errors.push(...validateDateString(toDate, 'toDate'));

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1)) {
    errors.push('limit must be a positive integer');
  }

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push('page must be a positive integer');
  }

  return errors;
});

exports.validateClaimCreate = runValidation((req) => {
  const body = req.body;
  const errors = [];

  if (!isValidObjectId(body.foundItem || '')) {
    errors.push('foundItem is required and must be a valid MongoDB ObjectId');
  }

  if (!isNonEmptyString(body.reason)) {
    errors.push('reason is required');
  }

  if (body.proofDetails !== undefined && !isNonEmptyString(body.proofDetails)) {
    errors.push('proofDetails must be a non-empty string');
  }

  if (body.supportingImages !== undefined) {
    errors.push(...validateImageUrls(body.supportingImages, 'supportingImages'));
  }

  return errors;
});

exports.validateClaimUpdate = runValidation((req) => {
  const body = req.body;
  const errors = [];

  errors.push(
    ...validateStatus(body.status, ['pending', 'approved', 'rejected', 'cancelled'], 'status')
  );

  if (body.resolutionNote !== undefined && !isNonEmptyString(body.resolutionNote)) {
    errors.push('resolutionNote must be a non-empty string');
  }

  return errors;
});
