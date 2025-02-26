import { PaginatedList } from "../pagination";
import { Resource } from "./resource";
import { Track } from "./track";
import { User } from "./user";

export class Playlist extends Resource {
  title!: string;
  description!: string;
  duration!: number;
  public!: boolean;
  is_loved_track!: boolean;
  collaborative!: boolean;
  nb_tracks!: number;
  unseen_track_count!: number;
  fans!: number;
  link!: string;
  share!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;
  checksum!: string;
  creator!: User;
  tracks?: Track[];

  /**
   * Get tracks from a playlist.
   * 
   * @returns {Promise<PaginatedList<Track>>} - a {@link PaginatedList} of {@link Track} instances.
   */
  async getTracks(params?: Record<string, string>): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>("tracks", params);
  }

  /**
   * Get fans from a playlist.
   * 
   * @returns {Promise<PaginatedList<User>>} - a {@link PaginatedList} of {@link User} instances.
   */
  async getFans(params?: Record<string, string>): Promise<PaginatedList<User>> {
    return this.getPaginatedList<User>("fans", params);
  }
}
