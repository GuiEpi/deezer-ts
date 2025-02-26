import { PaginatedList } from "../pagination";
import { Episode } from "./episode";
import { Resource } from "./resource";

export class Podcast extends Resource {
  title!: string;
  description!: string;
  available!: boolean;
  fans!: number;
  link!: string;
  share!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;

  /**
   * Get episodes from a podcast.
   *
   * @returns {Promise<PaginatedList<Episode>>} - a {@link PaginatedList} of {@link Episode} instances.
   */
  async getEpisodes(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Episode>> {
    return this.getPaginatedList<Episode>("episodes", params);
  }
}
