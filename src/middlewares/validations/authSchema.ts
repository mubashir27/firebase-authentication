import { ParamSchema, checkSchema } from "express-validator";
import { ERRORS } from "../../messages/error";
import {
  emailAddressSchema,
  passwordSchemaFunct,
  simpleTextSchemaFunc,
} from "../../utils/commonAuthSchema";

// type AllowedFields = {
//   email: "email";
//   password: "password";
//   name: "name";
// //   [key: string]: string;
// };

const signUpSchema = checkSchema({
  customFields: {
    // custom validation for checking we are getting right only allowed parameter in req.body
    custom: {
      options: (value, { req, location, path }) => {
        // const allowedFields: AllowedFields = {
        //   email: "email",
        //   password: "password",
        //   name: "name",
        // };
        const keys = Object.keys(req.body);
        if (keys?.length === 0) {
          throw new Error(ERRORS.invalidReqBody);
        }
        // keys.forEach((value: string) => {
        //   if (!allowedFields[value]) {
        //     throw new Error(`${ERRORS.invalidParameter} ${value}`);
        //   }
        // });
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
