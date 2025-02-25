// src/resources/Artist.ts

import { Album } from "./album";
import { Artist } from "./artist";
import { Resource } from "./resource";

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
  release_date?: string;
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
}
