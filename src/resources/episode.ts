import { parseDate } from "../date";
import { Podcast } from "./podcast";
import { Resource } from "./resource";

/**
 * To work with Deezer episode objects.
 *
 * @see the {@link https://developers.deezer.com/api/episode | Deezer Episode API Documentation}
 * for more details about each field.
 * 
 * @extends Resource
 * @category Resources
 */
export class Episode extends Resource {
  title!: string;
  description!: string;
  available!: boolean;
  release_date!: Date | null;
  duration!: number;
  link!: string;
  share!: string;
  picture!: string;
  picture_small!: string;
  picture_medium!: string;
  picture_big!: string;
  picture_xl!: string;
  podcast!: Podcast;

  /**
   * @internal
   */
  private _parse_release_date(params: string) {
    return parseDate(params);
  }
}
