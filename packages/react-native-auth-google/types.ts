type GoogleSignInErrorType =
  | "SIGN_IN_CANCELLED"
  | "IN_PROGRESS"
  | "PLAY_SERVICES_NOT_AVAILABLE"
  | "SIGN_IN_FAILED"
  | "SIGN_IN_REQUIRED"
  | "UNKNOWN";

class GoogleSignInError extends Error {
  /**
   * Create a new GoogleSignInError.
   * @param code The error code.
   * @param message A human-readable error message.
   * @param originalError The original error, if applicable.
   */
  constructor(
    public code: GoogleSignInErrorType,
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

type GoogleSignInResponse = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type { GoogleSignInResponse, GoogleSignInErrorType };

export { GoogleSignInError };
