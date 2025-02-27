import { Client } from "./client";
import { Resource } from "./resources";

/**
 * Constructor type for Resource classes.
 * Used to create new instances of resources from JSON responses.
 *
 * @category Core
 */
export type ResourceConstructor = new (
  client: Client,
  json: JsonResponse,
) => Resource;

/**
 * Generic constructor type for Resource classes.
 * Used to create new instances of specific resource types from JSON responses.
 *
 * @template T - The type of resource to construct, defaults to Resource
 * @category Core
 */
export type GenericResourceConstructor<T = Resource> = new (
  client: Client,
  json: JsonResponse,
) => T;

/**
 * Interface for paginated responses from the Deezer API.
 * Contains an array of items and pagination information.
 *
 * @template T - The type of items in the data array
 * @category Core
 */
export type GenericPaginatedList<T> = {
  /** Array of items in the current page */
  data: T[];
  /** Total number of items available */
  total: number;
  /** URL to the previous page, if available */
  prev?: string;
  /** URL to the next page, if available */
  next?: string;
};

export type DeezerResponseError = {
  error: {
    type: string;
    message: string;
    code: number;
  };
};

export type JsonResponse = {
  id?: number;
  type?: string;
  data?: JsonResponse[];
  next?: string;
  prev?: string;
  total?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
