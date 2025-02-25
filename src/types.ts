import { Client } from "./client";
import { Resource } from "./resources";

export type ResourceConstructor = new (client: Client, json: JsonResponse) => Resource;

export type GenericResourceConstructor<T = Resource> = new (
  client: Client,
  json: JsonResponse,
) => T;

export type GenericPaginatedList<T> = {
  data: T[];
  total: number;
  prev?: string;
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