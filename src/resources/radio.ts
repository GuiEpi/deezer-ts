import { Resource } from "./resource";
import { Track } from "./track";

export class Radio extends Resource {
  title!: string;
  description!: string;
  share!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;
  tracklist!: string;
  md5_image!: string;

  /**
   * Get first 40 tracks in the radio.
   *
   * Note that this endpoint is NOT paginated.
   *
   * @returns {Promise<Track[]>} - list of {@link Track} instances.
   */
  async getTracks(): Promise<Track[]> {
    return this.getRelation<Track[]>("tracks");
  }
}
