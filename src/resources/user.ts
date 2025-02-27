import { PaginatedList } from "../pagination";
import { Album } from "./album";
import { Artist } from "./artist";
import { Playlist } from "./playlist";
import { Resource } from "./resource";

/**
 * To work with Deezer user objects.
 *
 * @see the {@link https://developers.deezer.com/api/user | Deezer User API Documentation}
 * for more details about each field.
 *
 * @extends Resource
 * @category Resources
 */
export class User extends Resource {
  name!: string;
  lastname?: string;
  firstname?: string;
  email?: string;
  status?: number;
  birthday?: string;
  inscription_date?: string;
  gender?: string;
  link?: string;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
  country?: string;
  lang?: string;
  is_kid?: boolean;
  explicit_content_level?: string;
  explicit_content_levels_available?: string[];
  tracklist!: string;

  /**
   * Get user's favorite albums.
   *
   * @returns {Promise<PaginatedList<Album>>} - a {@link PaginatedList} of {@link Album} instances.
   */
  async getAlbums(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>("albums", params);
  }

  /**
   *  Get user's favorite artists.
   *
   * @returns {Promise<PaginatedList<Artist>>} - a {@link PaginatedList} of {@link Artist} instances.
   */
  async getArtists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Artist>> {
    return this.getPaginatedList<Artist>("artists", params);
  }

  /**
   * Get user's followings.
   *
   * @returns {Promise<PaginatedList<User>>} - a {@link PaginatedList} of {@link User} instances.
   */
  async getFollowers(
    params?: Record<string, string>,
  ): Promise<PaginatedList<User>> {
    return this.getPaginatedList<User>("followers", params);
  }

  /**
   * Get user's followers.
   *
   * @returns {Promise<PaginatedList<User>>} - a {@link PaginatedList} of {@link User} instances.
   */
  async getFollowings(
    params?: Record<string, string>,
  ): Promise<PaginatedList<User>> {
    return this.getPaginatedList<User>("followings", params);
  }

  /**
   * Get user's public playlists.
   *
   * @returns {Promise<PaginatedList<Playlist>>} - a {@link PaginatedList} of {@link Playlist} instances.
   */
  async getPlaylists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Playlist>> {
    return this.getPaginatedList<Playlist>("playlists", params);
  }
}
