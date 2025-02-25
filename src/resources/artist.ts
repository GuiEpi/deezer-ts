import { PaginatedList } from "../pagination";
import { Album } from "./album";
import { Playlist } from "./playlist";
import { Resource } from "./resource";
import { Track } from "./track";

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

  public async getTop(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>("top", params);
  }

  public async getRelated(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Artist>> {
    return this.getPaginatedList<Artist>("related", params);
  }

  public async getRadio(params?: Record<string, string>): Promise<Track[]> {
    return this.getRelation<Track[]>("radio", undefined, params, false);
  }

  public async getAlbums(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>("albums", params);
  }

  public async getPlaylists(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Playlist>> {
    return this.getPaginatedList<Playlist>("playlists", params);
  }
}
