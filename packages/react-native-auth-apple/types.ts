import { AppleRequestResponse } from "@invertase/react-native-apple-authentication";

type AppleSignInErrorType =
  | "CONFIGURATION_ERROR"
  | "SIGN_IN_FAILED"
  | "SIGN_IN_CANCELLED"
  | "INVALID_RESPONSE"
  | "NOT_HANDLED"
  | "UNKNOWN";

class AppleSignInError extends Error {
  /**
   * Create a new AppleSignInError.
   * @param code - The error code representing the type of Apple sign-in error.
   * @param message - A human-readable error message.
   * @param originalError - The original error, if applicable.
   */
  constructor(
    public code: AppleSignInErrorType,
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

type AppleHandledSignInResponse = {
  identityToken: string;
  nonce: string;
  firstName: string | null;
  lastName: string | null;
  email: AppleRequestResponse["email"];
  message?: string;
};

type AppleSignInResponse = Omit<
  AppleHandledSignInResponse,
  "identityToken" | "nonce"
> & { userId: string };

export type {
  AppleSignInErrorType,
  AppleSignInResponse,
  AppleHandledSignInResponse,
};

export { AppleSignInError };
