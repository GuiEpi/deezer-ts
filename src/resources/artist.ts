import { PaginatedList } from "../pagination";
import { Album } from "./album";
import { Playlist } from "./playlist";
import { Resource } from "./resource";
import { Track } from "./track";

/**
 * To work with Deezer artist objects.
 *
 * @see the {@link https://developers.deezer.com/api/artist | Deezer Artist API Documentation}
 * for more details about each field.
 */
export class Artist extends Resource {
  name!: string;
  link?: string;
  share?: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;
  nb_album?: number;
  nb_fan?: number;
  radio?: boolean;
  tracklist!: string;
  role?: string;

  /**
   * Get the top tracks of an artist.
   *
   * @returns {Promise<PaginatedList<Track>>} - a {@link PaginatedList} of {@link Track} instances.
   */
  async getTop(params?: Record<string, string>): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>("top", params);
  }

  /**
   * Get a list of related artists.
   *
   * @returns {Promise<PaginatedList<Artist>>} - a {@link PaginatedList} of {@link Artist} instances.
   */
  async getRelated(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Artist>> {
    return this.getPaginatedList<Artist>("related", params);
  }

  /**
   * Get a list of tracks.
   *
   * @returns {Promise<Track[]>} - list of {@link Track} instances.
   */
  async getRadio(params?: Record<string, string>): Promise<Track[]> {
    return this.getRelation<Track[]>("radio", undefined, params, false);
  }

  /**
   * Get a list of artist's albums.
   *
   * @returns {Promise<PaginatedList<Album>>} - a {@link PaginatedList} of {@link Album} instances.
   */
  public async getAlbums(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>("albums", params);
  }

  /**
   * Get a list of artist's playlists.
   *
   * @returns {Promise<PaginatedList<Playlist>>} - a {@link PaginatedList} of {@link Playlist} instances.
   */
  public async getPlaylists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Playlist>> {
    return this.getPaginatedList<Playlist>("playlists", params);
  }
}
