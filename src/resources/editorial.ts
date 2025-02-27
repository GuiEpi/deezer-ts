import { PaginatedList } from "../pagination";
import { Album } from "./album";
import { Chart } from "./chart";
import { Resource } from "./resource";

/**
 * To work with Deezer editorial objects.
 *
 * @see the {@link https://developers.deezer.com/api/editorial | Deezer Editorial API Documentation}
 * for more details about each field.
 *
 * @extends Resource
 * @category Resources
 */
export class Editorial extends Resource {
  name!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;

  /**
   * Get a list of albums selected every week by the Deezer Team.
   *
   * @returns {Promise<Album[]>} - list of {@link Album} instances.
   */
  async getSelection(): Promise<Album[]> {
    return this.getRelation<Album[]>("selection");
  }

  /**
   * Get top charts for tracks, albums, artists and playlists.
   *
   * @returns {Promise<Chart>} - a {@link Chart} instances.
   */
  async getChart(): Promise<Chart> {
    return this.getRelation<Chart>("charts", Chart);
  }

  /**
   * Get the new releases per genre for the current country.
   *
   * @returns {Promise<PaginatedList<Album>>} - a {@link PaginatedList} of {@link Album} instances.
   */
  async getReleases(
    params: Record<string, string>,
  ): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>("releases", params);
  }
}
