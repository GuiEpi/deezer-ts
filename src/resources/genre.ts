import { PaginatedList } from "../pagination";
import { Artist } from "./artist";
import { Podcast } from "./podcast";
import { Radio } from "./radio";
import { Resource } from "./resource";

/**
 * @module API Reference
 * @category Resources
 *
 * To work with Deezer genre objects.
 *
 * @see the {@link https://developers.deezer.com/api/genre | Deezer Genre API Documentation}
 * for more details about each field.
 */
export class Genre extends Resource {
  name!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;

  /**
   * Get all artists for a genre.
   *
   * @returns {Promise<Artist[]>} - list of {@link Artist} instances.
   */
  async getArtists(params?: Record<string, string>): Promise<Artist[]> {
    return this.getRelation<Artist[]>("artists", undefined, params);
  }

  /**
   * Get all podcasts for a genre.
   *
   * @returns {Promise<PaginatedList<Podcast>>} - a {@link PaginatedList} of {@link Podcast} instances.
   */
  async getPodcasts(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Podcast>> {
    return this.getPaginatedList<Podcast>("podcasts", params);
  }

  /**
   * Get all radios for a genre.
   *
   * @returns {Promise<Radio[]>} - list of {@link Artist} instances.
   */
  async getRadios(params?: Record<string, string>): Promise<Radio[]> {
    return this.getRelation<Radio[]>("radios", undefined, params);
  }
}
