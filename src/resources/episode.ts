// src/resources/Artist.ts

import { Podcast } from "./podcast";
import { Resource } from "./resource";

export class Episode extends Resource {
  title!: string;
  description!: string;
  available!: boolean;
  release_date!: string;
  duration!: number;
  link!: string;
  share!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;
  podcast!: Podcast;
}
