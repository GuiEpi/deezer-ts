/**
 * Base class for all Deezer API exceptions.
 * This is the parent class of all exceptions thrown by the library.
 *
 * @category Errors
 */
export class DeezerAPIException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeezerAPIException";
  }
}

/**
 * Represents errors that are temporary and can be retried.
 * These errors occur when a request fails but might succeed if retried.
 * Common scenarios include network issues or temporary service unavailability.
 *
 * @category Errors
 * @extends DeezerAPIException
 */
export class DeezerRetryableException extends DeezerAPIException {
  constructor(message: string) {
    super(message);
    this.name = "DeezerRetryableException";
  }
}

/**
 * Thrown when the API rate limit is exceeded.
 * Deezer imposes a limit of 50 requests per 5 seconds.
 * When this error occurs, you should wait before making new requests.
 *
 * @category Errors
 * @extends DeezerRetryableException
 *
 * @example
 * ```typescript
 * try {
 *   await client.getArtist(27);
 * } catch (error) {
 *   if (error instanceof DeezerQuotaExceededError) {
 *     // Wait for 5 seconds before retrying
 *     await new Promise(resolve => setTimeout(resolve, 5000));
 *     await client.getArtist(27);
 *   }
 * }
 * ```
 */
export class DeezerQuotaExceededError extends DeezerRetryableException {
  constructor() {
    super("Quota limit exceeded");
    this.name = "DeezerQuotaExceededError";
  }
}

/**
 * Base class for HTTP-related errors.
 * Wraps HTTP errors returned by the Deezer API.
 *
 * @category Errors
 * @extends DeezerAPIException
 */
export class DeezerHTTPError extends DeezerAPIException {
  constructor(response: Response) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = "DeezerHTTPError";
  }

  /**
   * Creates the appropriate HTTP error based on the response status code.
   *
   * @param response - The HTTP response object
   * @returns A specific HTTP error instance
   * @internal
   */
  static fromResponse(response: Response): DeezerHTTPError {
    if ([502, 503, 504].includes(response.status)) {
      return new DeezerRetryableHTTPError(response);
    }
    if (response.status === 403) {
      return new DeezerForbiddenError(response);
    }
    if (response.status === 404) {
      return new DeezerNotFoundError(response);
    }
    if (response.status === 429) {
      // HTTP 429 Too Many Requests
      return new DeezerQuotaExceededError();
    }
    return new DeezerHTTPError(response);
  }
}

/**
 * Represents temporary HTTP errors that can be retried.
 * This includes server errors (5xx) that might be temporary.
 *
 * @category Errors
 * @extends DeezerRetryableException
 */
export class DeezerRetryableHTTPError extends DeezerRetryableException {
  constructor(response: Response) {
    super(`Retryable HTTP ${response.status}: ${response.statusText}`);
    this.name = "DeezerRetryableHTTPError";
  }
}

/**
 * Thrown when access to a resource is forbidden.
 * This typically occurs when trying to access private resources
 * without proper authentication.
 *
 * @category Errors
 * @extends DeezerHTTPError
 */
export class DeezerForbiddenError extends DeezerHTTPError {
  constructor(response: Response) {
    super(response);
    this.name = "DeezerForbiddenError";
  }
}

/**
 * Thrown when a requested resource is not found (404).
 * This occurs when trying to access a resource that doesn't exist,
 * such as an invalid track ID or deleted content.
 *
 * @category Errors
 * @extends DeezerHTTPError
 */
export class DeezerNotFoundError extends DeezerHTTPError {
  constructor(response: Response) {
    super(response);
    this.name = "DeezerNotFoundError";
  }
}

/**
 * Represents errors returned by the Deezer API in its response body.
 * These are functional errors where the request was valid but the
 * API couldn't process it for business logic reasons.
 *
 * @category Errors
 * @extends DeezerAPIException
 */
export class DeezerErrorResponse extends DeezerAPIException {
  constructor(error: any) {
    super(error.message || "Unknown API error");
    this.name = "DeezerErrorResponse";

    if (error.message === "Quota limit exceeded") {
      throw new DeezerQuotaExceededError();
    }
  }
}

/**
 * Thrown when trying to access an unknown or invalid resource type.
 * This error occurs when the requested resource type is not supported
 * by the Deezer API or this library.
 *
 * @category Errors
 * @extends DeezerAPIException
 */
export class DeezerUnknownResource extends DeezerAPIException {
  constructor(message: string) {
    super(message);
    this.name = "DeezerUnknownResource";
  }
}
