import { Client } from "./client";
import { Resource } from "./resources";

/**
 * A paginated list of resources from the Deezer API.
 * This class implements AsyncIterable to allow for easy iteration over all items.
 * 
 * @category PaginatedList
 */
export class PaginatedList<T extends Resource> implements AsyncIterable<T> {
  private elements: T[] = [];
  private nextPath: string | null;
  private nextParams: Record<string, string> = {};
  private totalItems: number | null = null;

  constructor(
    private readonly client: Client,
    private readonly basePath: string,
    private readonly parent?: Resource,
    private readonly params?: Record<string, string>,
  ) {
    this.nextPath = basePath;
    this.nextParams = { ...params };
  }

  public async *[Symbol.asyncIterator](): AsyncIterator<T> {
    for (const element of this.elements) {
      yield element;
    }

    while (await this.couldGrow()) {
      const newElements = await this.grow();
      for (const element of newElements) {
        yield element;
      }
    }
  }

  /**
   * The total number of items in the list, mirroring what Deezer returns.
   *
   * @returns {Promise<number | null>} - The total number of items in the list.
   */
  public async total(): Promise<number | null> {
    if (this.totalItems === null) {
      const params = { ...this.params, limit: "1" };
      const response = await this.client.request(
        "GET",
        this.basePath,
        true,
        this.parent,
        undefined,
        undefined,
        params,
      );
      this.totalItems = response.total;
    }
    return this.totalItems;
  }

  /**
   * Returns a slice of the list.
   *
   * @param {number} start - The index to start the slice at.
   * @param {number} end - The index to end the slice at.
   *
   * @returns {Promise<T[]>} - The slice of the list.
   */
  public async slice(start: number = 0, end?: number): Promise<T[]> {
    const results: T[] = [];
    let count = 0;

    for await (const item of this) {
      if (count >= start) {
        results.push(item);
      }
      count++;

      if (end !== undefined && count >= end) {
        break;
      }
    }

    return results;
  }

  /**
   * Returns the item at the given index.
   *
   * @param {number} index - The index of the item to return.
   *
   * @returns {Promise<T>} - The item at the given index.
   */
  public async get(index: number): Promise<T> {
    const items = await this.slice(index, index + 1);
    if (items.length === 0 || !items[0]) {
      throw new Error(`Index ${index} is out of bounds`);
    }
    return items[0];
  }

  /**
   * Returns the list as an array.
   *
   * This method is not recommended for large lists, as it will fetch all items at once.
   *
   * @returns {Promise<T[]>} - The list as an array.
   */
  public async toArray(): Promise<T[]> {
    const results: T[] = [];
    for await (const item of this) {
      results.push(item);
    }
    return results;
  }

  private async couldGrow(): Promise<boolean> {
    return this.nextPath !== null;
  }

  private async grow(): Promise<T[]> {
    const newElements = await this.fetchNextPage();
    this.elements.push(...newElements);
    return newElements;
  }

  private async fetchNextPage(): Promise<T[]> {
    if (!this.nextPath) {
      return [];
    }

    const response = await this.client.request<T>(
      "GET",
      this.nextPath,
      true,
      this.parent,
      undefined,
      undefined,
      this.nextParams,
    );

    this.totalItems = response.total;

    if (response.next) {
      const url = new URL(response.next);
      this.nextPath = url.pathname.substring(1);
      this.nextParams = Object.fromEntries(url.searchParams);
    } else {
      this.nextPath = null;
    }

    return response.data;
  }
}
