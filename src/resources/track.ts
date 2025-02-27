import { Album } from "./album";
import { Artist } from "./artist";
import { Resource } from "./resource";

/**
 * @module API Reference
 * @category Resources
 *
 * To work with Deezer track objects.
 *
 * @see the {@link https://developers.deezer.com/api/track | Deezer Track API Documentation}
 * for more details about each field.
 */

export class Track extends Resource {
  readable!: boolean;
  title!: string;
  title_short!: string;
  title_version!: string;
  unseen?: boolean;
  isrc?: string;
  link?: string;
  share?: string;
  duration!: number;
  track_position?: number;
  disk_number?: number;
  rank!: number;
  release_date?: Date | null;
  explicit_lyrics!: boolean;
  explicit_content_lyrics!: number;
  explicit_content_cover!: number;
  preview!: string;
  bpm?: number;
  gain?: number;
  available_countries?: string[];
  alternative?: Track;
  contributors?: Artist[];
  md5_image!: string;
  artist!: Artist;
  album!: Album;

  /**
   * @internal
   */
  private _parse_release_date(params: string) {
    return new Date(params);
  }

  /**
   * @internal
   */
  private _parse_contributors(rawValue: Record<string, any>[]): Artist[] {
    return rawValue.map((val) => new Artist(this.client, val));
  }

  /**
   * Get the artist of the Track.
   *
   * @returns {Promise<Artist>} - the class {@link Artist} of the Track.
   */
  async getArtist(): Promise<Artist> {
    return this.client.getArtist(this.artist.id);
  }

  /**
   * Get the album of the Track.
   *
   * @returns {Promise<Album>} - the class {@link Album} of the Track.
   */
  async getAlbum(): Promise<Album> {
    return this.client.getAlbum(this.album.id);
  }
}
