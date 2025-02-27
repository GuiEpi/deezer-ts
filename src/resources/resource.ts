import { Client } from "../client";
import { PaginatedList } from "../pagination";

/**
 * @module API Reference
 * @category Resources
 *
 * Base class for all Deezer resources.
 * All resource classes inherit from this class.
 */
export class Resource {
  protected readonly client: Client;
  protected _fields: string[];
  protected _fetched: boolean = false;

  id!: number;
  type!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(client: Client, json: Record<string, any>) {
    this.client = client;
    for (const fieldName of Object.keys(json)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parseFunc = (this as any)[`_parse_${fieldName}`];
      if (typeof parseFunc === "function") {
        json[fieldName] = parseFunc.call(this, json[fieldName]);
      }
    }
    this._fields = Object.keys(json);
    Object.assign(this, json);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toJSON(): Record<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any> = {};
    for (const key of this._fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value = (this as any)[key];
      if (Array.isArray(value)) {
        value = value.map((i) => (i instanceof Resource ? i.toJSON() : i));
      } else if (value instanceof Resource) {
        value = value.toJSON();
      } else if (value instanceof Date) {
        value = value.toISOString();
        if (value.endsWith("T00:00:00.000Z")) {
          // Remove time part if it's not datetime
          value = value.slice(0, 10);
        }
      }
      result[key] = value;
    }
    return result;
  }

  public async getRelation<T>(
    relation: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resourceType?: new (client: Client, json: Record<string, any>) => Resource,
    params?: Record<string, string>,
    fwdParent: boolean = true,
  ): Promise<T> {
    return this.client.request(
      "GET",
      `${this.type}/${this.id}/${relation}`,
      false,
      fwdParent ? this : undefined,
      resourceType,
      undefined,
      params,
    );
  }

  public getPaginatedList<T extends Resource>(
    relation: string,
    params?: Record<string, string>,
  ): PaginatedList<T> {
    return new PaginatedList<T>(
      this.client,
      `${this.type}/${this.id}/${relation}`,
      this,
      params,
    );
  }

  /**
   * Ensures a field is loaded, fetching the full resource if necessary.
   *
   * @param fieldName The name of the field to ensure
   * @returns The value of the field
   * @throws Error if the field cannot be loaded
   */
  protected async ensureField<T>(fieldName: string): Promise<T> {
    // Try to infer the field if possible
    if (
      !this._fields.includes(fieldName) ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[fieldName] === undefined
    ) {
      // If not inferred and not fetched yet, try to get the full resource
      if (!this._fetched) {
        const fullResource = await this.get();
        const missingFields = Object.keys(fullResource).filter(
          (field) =>
            !this._fields.includes(field) &&
            !["client", "_fields", "_fetched"].includes(field),
        );
        for (const field of missingFields) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any)[field] = (fullResource as any)[field];
          this._fields.push(field);
        }

        if (
          this._fields.includes(fieldName) &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any)[fieldName] !== undefined
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (this as any)[fieldName] as T;
        }
      }

      throw new Error(
        `Field '${fieldName}' is not available on ${this.constructor.name} with id ${this.id}`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any)[fieldName] as T;
  }

  /**
   * Get the resource from the API.
   *
   * @returns {Promise<this>}
   */
  public async get(): Promise<this> {
    this._fetched = true;
    return await this.client.request("GET", `${this.type}/${this.id}`, false);
  }
}
