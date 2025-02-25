export class DeezerAPIException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeezerAPIException";
  }
}

export class DeezerRetryableException extends DeezerAPIException {
  constructor(message: string) {
    super(message);
    this.name = "DeezerRetryableException";
  }
}

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

export class DeezerRetryableHTTPError extends DeezerRetryableException {
  constructor(response: Response) {
    super(`Retryable HTTP ${response.status}: ${response.statusText}`);
    this.name = "DeezerRetryableHTTPError";
  }
}

export class DeezerForbiddenError extends DeezerHTTPError {
  constructor(response: Response) {
    super(response);
    this.name = "DeezerForbiddenError";
  }
}

export class DeezerNotFoundError extends DeezerHTTPError {
  constructor(response: Response) {
    super(response);
    this.name = "DeezerNotFoundError";
  }
}

export class DeezerErrorResponse extends DeezerAPIException {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(error: any) {
    super(error.message || "Unknown API error");
    this.name = "DeezerErrorResponse";
  }
}

export class DeezerUnknownResource extends DeezerAPIException {
  constructor(message: string) {
    super(message);
    this.name = "DeezerUnknownResource";
  }
}
