// src/resources/Artist.ts

import { Resource } from "./resource";

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
}
