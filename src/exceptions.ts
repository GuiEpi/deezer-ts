/**
 * Base exception for API errors.
 */
export class DeezerAPIException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeezerAPIException";
  }
}

/**
 * A request failing with this might work if retried.
 */
export class DeezerRetryableException extends DeezerAPIException {
  constructor(message: string) {
    super(message);
    this.name = "DeezerRetryableException";
  }
}

/**
 * Specialization wrapping HTTP errors.
 */
export class DeezerHTTPError extends DeezerAPIException {
  constructor(response: Response) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = "DeezerHTTPError";
  }

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
    return new DeezerHTTPError(response);
  }
}

/**
 * An HTTP error due to a potentially temporary issue.
 */
export class DeezerRetryableHTTPError extends DeezerRetryableException {
  constructor(response: Response) {
    super(`Retryable HTTP ${response.status}: ${response.statusText}`);
    this.name = "DeezerRetryableHTTPError";
  }
}

/**
 * A HTTP error cause by permission denied error.
 */
export class DeezerForbiddenError extends DeezerHTTPError {
  constructor(response: Response) {
    super(response);
    this.name = "DeezerForbiddenError";
  }
}

/**
 * For 404 HTTP errors.
 */
export class DeezerNotFoundError extends DeezerHTTPError {
  constructor(response: Response) {
    super(response);
    this.name = "DeezerNotFoundError";
  }
}

/**
 * A request failing with this might work if retried.
 */
export class DeezerErrorResponse extends DeezerAPIException {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(error: any) {
    super(error.message || "Unknown API error");
    this.name = "DeezerErrorResponse";
  }
}

/**
 * A functional error when the API doesn't accept the request.
 */
export class DeezerUnknownResource extends DeezerAPIException {
  constructor(message: string) {
    super(message);
    this.name = "DeezerUnknownResource";
  }
}
