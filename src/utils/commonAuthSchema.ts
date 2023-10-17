import { ERRORS } from "../messages/errors";
import { EmailValidationSchema, TextValidationSchema } from "../types";
import { Location } from "express-validator";

// Define your email address schema using the custom type
const emailAddressSchema: EmailValidationSchema = {
  in: "body",
  exists: { options: { checkNull: true, checkFalsy: true } },
  errorMessage: "Email is required",
  isString: {
    errorMessage: "Email must be a string",
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: "Email must not be empty",
    bail: true,
  },
  isEmail: {
    errorMessage: "Invalid email format",
    bail: true,
  },
  normalizeEmail: true,
  trim: true,
};

// passwordSchema function in authSchema
const passwordSchemaFunct = ({
  dataIn = "body",
  label = "",
  required = true,
}) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  errorMessage: `${label} ${ERRORS.required}`,
  isString: {
    errorMessage: `${label} ${ERRORS.mustBeString}`,
  },
  isStrongPassword: {
    options: {
      minSymbols: 0,
      minNumbers: 1,
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
    },
    errorMessage: ERRORS.invalidPassType,
  },
});

// simple textSchemaFunction for plain text schema checking
const simpleTextSchemaFunc = ({
  dataIn = "body",
  label = "",
  required = true,
}): TextValidationSchema => ({
  in: dataIn as Location,
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} ${ERRORS.required}`,
  isString: {
    errorMessage: `${label} ${ERRORS.mustBeString}`,
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: `${label} ${ERRORS.required}`,
    bail: true,
  },
  trim: true,
});

const simpleBooleanSchemaFunc = ({
  dataIn = "body",
  label = "",
  required = true,
}) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} ${ERRORS.required}`,
  isString: {
    errorMessage: `${label} ${ERRORS.mustBeString}`,
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: `${label} ${ERRORS.required}`,
    bail: true,
  },
  trim: true,
});

// simple simpleIntSchemaFunc for checking if input is integer
const simpleIntSchemaFunc = ({
  dataIn = "body",
  label = "",
  required = true,
}) => ({
  in: [dataIn],
  exists: required ? { options: { checkNull: true, checkFalsy: true } } : null,
  optional: required ? null : { options: { nullable: true } },
  errorMessage: `${label} ${ERRORS.required}`,
  isInt: {
    errorMessage: `${label} ${ERRORS.mustBeAnInt}`,
    bail: true,
  },
  notEmpty: {
    options: { ignore_whitespace: true },
    errorMessage: `${label} ${ERRORS.required}`,
    bail: true,
  },
  trim: true,
});

export {
  emailAddressSchema,
  passwordSchemaFunct,
  simpleTextSchemaFunc,
  simpleBooleanSchemaFunc,
  simpleIntSchemaFunc,
};
