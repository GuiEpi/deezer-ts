import { Resource } from "./resource";
import { Artist } from "./artist";
import { Podcast } from "./podcast";
import { Playlist } from "./playlist";
import { Album } from "./album";
import { Track } from "./track";
import { PaginatedList } from "../pagination";

export class Chart extends Resource {
  tracks!: Track[] | [];
  albums!: Album[] | [];
  artists!: Artist[] | [];
  playlists!: Playlist[] | [];
  podcasts!: Podcast[] | [];
  type: string = "chart";

  /**
   * Return the chart for tracks.
   *
   * @param params Record<string, string>
   * @returns Promise<PaginatedList<Track>>
   */
  public async getTracks(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>("tracks", params);
  }

  /**
   * Return the chart for albums.
   * @param params Record<string, string>
   * @returns Promise<PaginatedList<Album>>
   */
  public async getAlbums(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>("albums", params);
  }

  /**
   * Return the chart for artists.
   * @param params Record<string, string>
   * @returns Promise<PaginatedList<Artist>>
   */
  public async getArtists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Artist>> {
    return this.getPaginatedList<Artist>("artists", params);
  }

  /**
   * Return the chart for podcasts.
   * @param params Record<string, string>
   * @returns Promise<PaginatedList<Podcast>>
   */
  public async getPlaylists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Playlist>> {
    return this.getPaginatedList<Playlist>("playlists", params);
  }
}
