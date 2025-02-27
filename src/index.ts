/**
 * A TypeScript wrapper for the Deezer API.
 *
 * @packageDocumentation
 */

export { Client } from "./client";
export { PaginatedList } from "./pagination";

// Resources
export {
  Album,
  Artist,
  Chart,
  Editorial,
  Episode,
  Genre,
  Playlist,
  Podcast,
  Radio,
  Resource,
  Track,
  User,
} from "./resources";

// Exceptions
export {
  DeezerAPIException,
  DeezerErrorResponse,
  DeezerForbiddenError,
  DeezerHTTPError,
  DeezerNotFoundError,
  DeezerQuotaExceededError,
  DeezerRetryableException,
  DeezerRetryableHTTPError,
  DeezerUnknownResource,
} from "./exceptions";
