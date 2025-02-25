// src/resources/Artist.ts

import { parseDate } from "../date";
import { PaginatedList } from "../pagination";
import { Artist } from "./artist";
import { Genre } from "./genre";
import { Resource } from "./resource";
import { Track } from "./track";

export class Album extends Resource {
  title!: string;
  upc?: string;
  link?: string;
  share?: string;
  cover!: string;
  cover_small!: string;
  cover_medium!: string;
  cover_big!: string;
  cover_xl!: string;
  md5_image!: string;

  genre_id?: number;
  genres?: Genre[];
  label?: string;
  nb_tracks?: number;
  duration?: number;
  fans?: number;
  release_date?: Date | null;
  record_type?: string;
  available?: boolean;

  alternative?: Album;
  tracklist!: string;
  explicit_lyrics?: boolean;

  explicit_content_lyrics?: number;
  explicit_content_cover?: number;
  contributors?: Artist[];

  artist?: Artist;
  tracks?: Track[];

  role?: string;

  private parse_release_date(params: string) {
    return parseDate(params);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parse_contributors(rawValue: Record<string, any>[]): Artist[] {
    return rawValue.map((val) => new Artist(this.client, val));
  }

  async getArtist(): Promise<Artist> {
    const artist = await this.ensureField<Artist>("artist");
    return this.client.getArtist(artist.id);
  }

  async getTracks(
    params?: Record<string, string>,
  ): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>("track", params);
  }
}
