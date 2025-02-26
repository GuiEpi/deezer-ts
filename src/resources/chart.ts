import { Resource } from "./resource";
import { Artist } from "./artist";
import { Podcast } from "./podcast";
import { Playlist } from "./playlist";
import { Album } from "./album";
import { Track } from "./track";
import { PaginatedList } from "../pagination";

/**
 * To work with Deezer chart objects.
 *
 * @see the {@link https://developers.deezer.com/api/chart | Deezer Chart API Documentation}
 * for more details about each field.
 */
export class Chart extends Resource {
  tracks!: Track[] | [];
  albums!: Album[] | [];
  artists!: Artist[] | [];
  playlists!: Playlist[] | [];
  podcasts!: Podcast[] | [];
  type: string = "chart";

  /**
   *  Return the chart for tracks.
   *
   * @returns {Promise<PaginatedList<Track>>} - a {@link PaginatedList} of {@link Track} instances.
   */
  async getTracks(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>("tracks", params);
  }

  /**
   * Return the chart for albums.
   *
   * @returns {Promise<PaginatedList<Album>>} - a {@link PaginatedList} of {@link Album} instances.
   */
  async getAlbums(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>("albums", params);
  }

  /**
   * Return the chart for artists.
   *
   * @returns {Promise<PaginatedList<Artist>>} - a {@link PaginatedList} of {@link Artist} instances.
   */
  async getArtists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Artist>> {
    return this.getPaginatedList<Artist>("artists", params);
  }

  /**
   * Return the chart for playlists.
   *
   * @returns {Promise<PaginatedList<Playlist>>} - a {@link PaginatedList} of {@link Playlist} instances.
   */
  async getPlaylists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Playlist>> {
    return this.getPaginatedList<Playlist>("playlists", params);
  }

  /**
   * Return the chart for podcasts.
   *
   * @returns {Promise<PaginatedList<Podcast>>} - a {@link PaginatedList} of {@link Podcast} instances.
   */
  async getPodcasts(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Podcast>> {
    return this.getPaginatedList<Podcast>("podcasts", params);
  }
}
