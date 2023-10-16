import { ParamSchema, checkSchema } from "express-validator";
import { ERRORS } from "../../messages/errors";
import {
  emailAddressSchema,
  passwordSchemaFunct,
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

export { signUpSchema };
