// types/mongoose.d.ts
import { Error } from "mongoose";

declare global {
  type MongooseValidationError = Error.ValidationError;
  type MongooseValidatorError = Error.ValidatorError;
}
