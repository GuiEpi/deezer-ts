// src/resources/Artist.ts

import { Resource } from "./resource";

export class Podcast extends Resource {
  title!: string;
  description!: string;
  available!: boolean;
  fans!: number;
  link!: string;
  share!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;
}
