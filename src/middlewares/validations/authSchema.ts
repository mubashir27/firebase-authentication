import { ParamSchema, checkSchema } from "express-validator";
import { ERRORS } from "../../messages/errors";
import {
  emailAddressSchema,
  passwordSchemaFunct,
  simpleIntSchemaFunc,
  simpleTextSchemaFunc,
} from "../../utils/commonAuthSchema";

const signUpSchema = checkSchema({
  customFields: {
    // custom validation for checking we are getting right only allowed parameter in req.body
    custom: {
      options: (value, { req, location, path }) => {
        const keys = Object.keys(req.body);
        if (keys?.length === 0) {
          throw new Error(ERRORS.invalidReqBody);
        }
        return value + req.body + location + path;
      },
    },
  },
  email: emailAddressSchema,
  password: passwordSchemaFunct({
    label: "password",
  }) as unknown as ParamSchema,
  name: simpleTextSchemaFunc({
    label: "name",
  }) as unknown as ParamSchema,
});

const singInSchema = checkSchema({
  customFields: {
    // custom validation for checking we are getting right only allowed parameter in req.body
    custom: {
      options: (value, { req, location, path }) => {
        const keys = Object.keys(req.body);
        if (keys?.length === 0) {
          throw new Error(ERRORS.invalidReqBody);
        }
        return value + req.body + location + path;
      },
    },
  },
  email: emailAddressSchema,
  password: passwordSchemaFunct({
    label: "password",
  }) as unknown as ParamSchema,
});

const verificationSchema = checkSchema({
  customFields: {
    // custom validation for checking we are getting right only allowed parameter in req.body
    custom: {
      options: (value, { req, location, path }) => {
        const keys = Object.keys(req.body);
        if (keys?.length === 0) {
          throw new Error(ERRORS.invalidReqBody);
        }
        return value + req.body + location + path;
      },
    },
  },
  email: emailAddressSchema,
  otp: simpleIntSchemaFunc({
    label: "otp",
  }) as unknown as ParamSchema,
});

const forgotPasswordSchema = checkSchema({
  customFields: {
    // custom validation for checking we are getting right only allowed parameter in req.body
    custom: {
      options: (value, { req, location, path }) => {
        const keys = Object.keys(req.body);
        if (keys?.length === 0) {
          throw new Error(ERRORS.invalidReqBody);
        }
        return value + req.body + location + path;
      },
    },
  },
  email: emailAddressSchema,
});

export { signUpSchema, singInSchema, verificationSchema, forgotPasswordSchema };
