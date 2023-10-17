export interface IEmail {
  email: string;
}

export type IData = (data: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => void;

export interface EmailValidationSchema {
  in: Location;
  exists: { options: { checkNull: boolean; checkFalsy: boolean } };
  errorMessage: string;
  isString: { errorMessage: string; bail: boolean };
  notEmpty: {
    options: { ignore_whitespace: boolean };
    errorMessage: string;
    bail: boolean;
  };
  isEmail: { errorMessage: string; bail: boolean };
  normalizeEmail: boolean;
  trim: boolean;
}
export interface TextValidationSchema {
  in: Location;
  exists: { options: { checkNull: boolean; checkFalsy: boolean } } | null;
  errorMessage: string;
  isString: { errorMessage: string; bail: boolean };
  notEmpty: {
    options: { ignore_whitespace: boolean };
    errorMessage: string;
    bail: boolean;
  };
  trim: boolean;
  optional: { options: { nullable: boolean } } | null;
}
export type User = {
  id: string;
  email: string;
  password: string;
  otp: string;
  otp_expires: Date;
  verified: boolean;
  phoneNumber: string;
  surName: string;
  name: string;
};
