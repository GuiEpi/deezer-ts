import {
  DeezerAPIException,
  DeezerErrorResponse,
  DeezerHTTPError,
  DeezerQuotaExceededError,
  DeezerRetryableException,
  DeezerUnknownResource,
} from "./exceptions";
import { PaginatedList } from "./pagination";
import {
  Album,
  Artist,
  Chart,
  Editorial,
  Episode,
  Genre,
  Playlist,
  Podcast,
  Radio,
  Resource,
  Track,
  User,
} from "./resources";
import {
  DeezerResponseError,
  GenericPaginatedList,
  GenericResourceConstructor,
  JsonResponse,
  ResourceConstructor,
} from "./types";

/**
 * A client to retrieve some basic infos about Deezer resources.
 *
 * Create a client instance with the given options.
 * Options should be passed in to the constructor as kwargs.
 *
 * @example
 * ```ts
 * import { Client } from "deezer-ts";
 * client = new Client();
 * ```
 * This client provides several methods to retrieve the content
 * most kinds of Deezer objects, based on their json structure.
 *
 * Headers can be forced by using the `headers` kwarg.
 * For example, use `Accept-Language` header to force the output language.
 *
 * @example
 * ```ts
 * import { Client } from "deezer-ts";
 * client = new Client({ headers: { "Accept-Language": "en" } });
 * ```
 * @param {Record<string, string>} headers - Additional headers to pass.
 *
 * @category Client
 */
export class Client {
  /**
   * @internal
   */
  private baseUrl: string = "https://api.deezer.com";

  private static requestQueue: { timestamp: number }[] = [];
  private static readonly QUOTA_WINDOW = 5000; // 5 seconds in ms
  private static readonly QUOTA_LIMIT = 50; // 50 requests per 5 seconds

  /**
   * Create a new client instance.
   *
   * @param {Record<string, string>} [headers] - Additional headers to pass.
   */
  constructor(private headers?: Record<string, string>) {}

  /**
   * @internal
   */
  private readonly objectsTypes: Record<
    string,
    GenericResourceConstructor | null
  > = {
    album: Album,
    artist: Artist,
    chart: Chart,
    editorial: Editorial,
    episode: Episode,
    genre: Genre,
    playlist: Playlist,
    podcast: Podcast,
    radio: Radio,
    search: null,
    track: Track,
    user: User,
  };

  /**
   * @internal
   * Ensures we don't exceed Deezer's rate limit of 50 requests per 5 seconds
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    // Remove requests older than QUOTA_WINDOW
    Client.requestQueue = Client.requestQueue.filter(
      (req) => now - req.timestamp < Client.QUOTA_WINDOW,
    );

    if (Client.requestQueue.length >= Client.QUOTA_LIMIT) {
      const oldestRequest = Client.requestQueue[0];
      if (oldestRequest) {
        const waitTime = Client.QUOTA_WINDOW - (now - oldestRequest.timestamp);
        if (waitTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    Client.requestQueue.push({ timestamp: Date.now() });
  }

  /**
   * @internal
   * Retries an operation with exponential backoff when encountering retryable errors.
   *
   * This method implements an exponential backoff strategy for retrying failed operations:
   * - Initial delay is baseDelay (default 2000ms)
   * - Each retry doubles the delay
   * - Adds random jitter (75-125% of calculated delay) to prevent thundering herd
   * - Only retries on quota exceeded or other retryable errors
   *
   * @param {() => Promise<T>} operation - The async operation to retry
   * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
   * @param {number} baseDelay - Base delay in milliseconds before first retry (default: 2000)
   * @returns {Promise<T>} The result of the operation if successful
   * @throws {Error} The last error encountered if all retries fail
   * @throws {Error} Non-retryable errors immediately without retry
   * @template T - The return type of the operation
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 2000,
  ): Promise<T> {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (
          error instanceof DeezerQuotaExceededError ||
          error instanceof DeezerRetryableException
        ) {
          lastError = error;
          const delay =
            baseDelay * Math.pow(2, attempt) * (0.75 + Math.random() * 0.5);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  /**
   * @internal
   *
   * Recursively convert dictionary to Resource object.
   *
   * @param item - the JSON response as object.
   * @param parent - A reference to the parent resource, to avoid fetching again.
   * @param resourceType - The resource class to use as top level.
   * @param resourceId - The resource id to use as top level.
   * @param paginateList - Whether to wrap list into a pagination object.
   * @returns instance of Resource
   * @throws DeezerUnknownResource
   */
  private _processJson<T>(
    item: JsonResponse,
    paginateList: boolean = false,
    parent?: Resource,
    resourceType?: ResourceConstructor,
    resourceId?: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): GenericResourceConstructor<T> | GenericPaginatedList<T> | any {
    if (item.data) {
      const parsedData = item.data.map((i) =>
        this._processJson(i, false, parent),
      );

      if (!paginateList) {
        return parsedData;
      }

      item.data = parsedData;
      // paginated response
      return item;
    }

    const result: JsonResponse = {};
    for (const key in item) {
      let value = item[key];
      if (
        value !== null &&
        typeof value === "object" &&
        ("type" in value || "data" in value)
      ) {
        value = this._processJson(value, false, parent);
      }
      result[key] = value;
    }
    if (parent) {
      result[parent.type] = parent;
    }

    // in case object does not have an id e.g. chart
    if (result.id === undefined && resourceId !== null) {
      result.id = resourceId;
    }

    let objectClass:
      | GenericResourceConstructor<T>
      | ResourceConstructor
      | null = null;
    if (result.type && result.type in this.objectsTypes) {
      // @ts-expect-error Type is safe as we've checked result.type in objectsTypes
      objectClass = this.objectsTypes[result.type];
    } else if (result.type || (!resourceType && result.id)) {
      // in case any new types are introduced by the API
      objectClass = Resource;
    } else if (resourceType) {
      // in case object does not have a type e.g. chart
      objectClass = resourceType;
    } else {
      throw new DeezerUnknownResource(
        `Unable to find resource type for ${JSON.stringify(result)}`,
      );
    }
    // assert objectClass is not null
    if (objectClass === null) {
      throw new DeezerUnknownResource(
        `Object class is null for ${JSON.stringify(result)}`,
      );
    }

    debugger; // Examine final processed result
    return new objectClass(this, result);
  }

  /**
   * Make a request to the API and parse the response.
   *
   * @template T - The type of the response.
   * @param {string} method - The HTTP method to use.
   * @param {string} path - The path to request.
   * @param {boolean} paginateList - Whether to paginate the response.
   * @param {Resource} [parent] - The parent resource.
   * @param {ResourceConstructor} [resourceType] - The resource type.
   * @param {number} [resourceId] - The resource id.
   * @param {Record<string, string>} [params] - Additional parameters to pass.
   * @returns {Promise<T>} - The response.
   */
  async request<T>(
    method: string,
    path: string,
    paginateList: false,
    parent?: Resource,
    resourceType?: ResourceConstructor,
    resourceId?: number,
    params?: Record<string, string>,
  ): Promise<T>;

  /**
   * Make a request to the API and parse the response.
   *
   * @template T - The type of the response.
   * @param {string} method - The HTTP method to use.
   * @param {string} path - The path to request.
   * @param {boolean} paginateList - Whether to paginate the response.
   * @param {Resource} [parent] - The parent resource.
   * @param {ResourceConstructor} [resourceType] - The resource type.
   * @param {number} [resourceId] - The resource id.
   * @param {Record<string, string>} [params] - Additional parameters to pass.
   * @returns {GenericPaginatedList<T>} - The response.
   */
  async request<T>(
    method: string,
    path: string,
    paginateList: true,
    parent?: Resource,
    resourceType?: ResourceConstructor,
    resourceId?: number,
    params?: Record<string, string>,
  ): Promise<GenericPaginatedList<T>>;

  async request<T>(
    method: string,
    path: string,
    paginateList: boolean = false,
    parent?: Resource,
    resourceType?: ResourceConstructor,
    resourceId?: number,
    params?: Record<string, string>,
  ): Promise<T | GenericPaginatedList<T>> {
    return this.retryWithBackoff(async () => {
      await this.enforceRateLimit();
      const url = new URL(`${this.baseUrl}/${path}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      const response = await fetch(url, {
        method,
        headers: {
          ...this.headers,
        },
      });

      if (!response.ok) {
        throw DeezerHTTPError.fromResponse(response);
      }

      const data = (await response.json()) as
        | JsonResponse
        | DeezerResponseError;

      if (data.error) {
        throw new DeezerErrorResponse(data.error);
      }

      return this._processJson<T>(
        data,
        paginateList,
        parent,
        resourceType,
        resourceId,
      );
    });
  }

  /**
   * @internal
   * @private
   */
  private getPaginatedList<T extends Resource>(
    path: string,
    params?: Record<string, string>,
  ): PaginatedList<T> {
    return new PaginatedList<T>(this, path, undefined, params);
  }

  /**
   * Get the album with the given id.
   *
   * @param {number} albumId - The id of the album to get.
   * @returns {@link Album} - An album object.
   */
  async getAlbum(albumId: number): Promise<Album> {
    return this.request<Album>("GET", `album/${albumId}`, false);
  }

  /**
   * Get the artist with the given id.
   *
   * @param {number} artistId - The id of the artist to get.
   * @returns {@link Artist} - An artist object.
   */
  async getArtist(artistId: number): Promise<Artist> {
    return this.request<Artist>("GET", `artist/${artistId}`, false);
  }

  /**
   * Get overall charts for tracks, albums, artists and playlists for the given genre ID.
   *
   * Combine charts of several resources in one endpoint.
   *
   * @param {number} genreId - The genre id, default to `All` genre (genreId = 0).
   * @returns {@link Chart} - A chart instance.
   */
  async getChart(genreId: number = 0): Promise<Chart> {
    return this.request<Chart>(
      "GET",
      `chart/${genreId}`,
      false,
      undefined,
      Chart,
      genreId,
    );
  }

  /**
   * Get top tracks for the given genre id.
   *
   * @param {number} genreId - The genre id, default to `All` genre (genreId = 0).
   * @returns A list of {@link Track} instances.
   */
  async getTracksChart(genreId: number = 0): Promise<Track[]> {
    return this.request<Track[]>("GET", `chart/${genreId}/tracks`, false);
  }

  /**
   * Get top albums for the given genre id.
   *
   * @param {number} genreId - The genre id, default to `All` genre (genreId = 0).
   * @returns A list of {@link Album} instances.
   */
  async getAlbumsChart(genreId: number = 0): Promise<Album[]> {
    return this.request<Album[]>("GET", `chart/${genreId}/albums`, false);
  }

  /**
   * Get top artists for the given genre id.
   *
   * @param {number} genreId - The genre id, default to `All` genre (genreId = 0).
   * @returns A list of {@link Artist} instances.
   */
  async getArtistsChart(genreId: number = 0): Promise<Artist[]> {
    return this.request<Artist[]>("GET", `chart/${genreId}/artists`, false);
  }

  /**
   * Get top playlists for the given genre id.
   *
   * @param {number} genreId - The genre id, default to `All` genre (genreId = 0).
   * @returns A list of {@link Playlist} instances.
   */
  async getPlaylistsChart(genreId: number = 0): Promise<Playlist[]> {
    return this.request<Playlist[]>("GET", `chart/${genreId}/playlists`, false);
  }

  /**
   * Get top podcasts for the given genre id.
   *
   * @param {number} genreId - The genre id, default to `All` genre (genreId = 0).
   * @returns A list of {@link Podcast} instances.
   */
  async getPodcastsChart(genreId: number = 0): Promise<Podcast[]> {
    return this.request<Podcast[]>("GET", `chart/${genreId}/podcasts`, false);
  }

  /**
   * Get the editorial with the given id.
   *
   * @param {number} editorialId - The id of the editorial to get.
   * @returns a {@link Editorial} object.
   */
  async getEditorial(editorialId: number): Promise<Editorial> {
    return this.request<Editorial>("GET", `editorial/${editorialId}`, false);
  }

  /**
   * List editorials.
   *
   * @returns {@link PaginatedList} of {@link Editorial} - An editorial object.
   */
  async listEditorials(): Promise<PaginatedList<Editorial>> {
    return this.getPaginatedList<Editorial>("editorial");
  }

  /**
   * Get the episode with the given id.
   *
   * @param {number} episodeId - The id of the episode to get.
   * @returns {@link Episode} - An episode object.
   */
  async getEpisode(episodeId: number): Promise<Episode> {
    return this.request<Episode>("GET", `episode/${episodeId}`, false);
  }

  /**
   * Get the genre with the given id.
   *
   * @param {number} genreId - The id of the genre to get.
   * @returns {@link Genre} - A genre object.
   */
  async getGenre(genreId: number): Promise<Genre> {
    return this.request<Genre>("GET", `genre/${genreId}`, false);
  }

  /**
   * Get the playlist with the given id.
   *
   * @param {number} playlistId - The id of the playlist to get.
   * @returns {@link Playlist} - A playlist object.
   */
  async getPlaylist(playlistId: number): Promise<Playlist> {
    return this.request<Playlist>("GET", `playlist/${playlistId}`, false);
  }

  /**
   * Get the podcast with the given id.
   *
   * @param {number} podcastId - The id of the podcast to get.
   * @returns {@link Podcast} - A podcast object.
   */
  async getPodcast(podcastId: number): Promise<Podcast> {
    return this.request<Podcast>("GET", `podcast/${podcastId}`, false);
  }

  /**
   * Get the radio with the given id.
   *
   * @param {number} radioId - The id of the radio to get.
   * @returns {@link Radio} - A radio object.
   */
  async getRadio(radioId: number): Promise<Radio> {
    return this.request<Radio>("GET", `radio/${radioId}`, false);
  }

  /**
   * List radios.
   *
   * @returns A list of {@link Radio} instances.
   */
  async listRadios(): Promise<Radio[]> {
    return this.request<Radio[]>("GET", "radio", false);
  }

  /**
   * Get the top radios.
   *
   * @returns {@link PaginatedList} of {@link Radio} objects.
   */
  async getRadioTop(): Promise<PaginatedList<Radio>> {
    return this.getPaginatedList<Radio>("radio/top");
  }

  /**
   * Get the track with the given id.
   *
   * @param {number} trackId - The id of the track to get.
   * @returns {@link Track} - A track object.
   */
  async getTrack(trackId: number): Promise<Track> {
    return this.request<Track>("GET", `track/${trackId}`, false);
  }

  /**
   * Get the user with the given id.
   *
   * @param {number} userId - The id of the user to get.
   * @returns {@link User} - A user object.
   */
  async getUser(userId: number): Promise<User> {
    return this.request<User>("GET", `user/${userId}`, false);
  }

  /**
   * Get the flow of the user with the given id.
   *
   * @param {number} userId - The id of the user to get.
   * @param {Record<string, string>} [params] - Additional parameters to pass.
   * @returns {@link PaginatedList} of {@link Track} - A list of tracks.
   */
  async getUserFlow(
    userId: number,
    params?: Record<string, string>,
  ): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>(`user/${userId}`, params);
  }

  /**
   * Get the favourites albums for the given userId.
   *
   * @param {number} userId - The user id to get the favourite albums.
   * @returns {@link PaginatedList} of {@link Album} - A list of albums.
   */
  async getUserAlbums(userId: number): Promise<PaginatedList<Album>> {
    return this.getPaginatedList<Album>(`user/${userId}/albums`);
  }

  /**
   * Get the favourite artists for the given userId.
   *
   * @param {number} userId - The user id to get the favourite artists.
   * @returns {@link PaginatedList} of {@link Artist} - A list of artists.
   */
  async getUserArtists(userId: number): Promise<PaginatedList<Artist>> {
    return this.getPaginatedList<Artist>(`user/${userId}/artists`);
  }

  /**
   * Get the followers for the given userId.
   *
   * @param {number} userId - The user id to get followers.
   * @returns {@link PaginatedList} of {@link User} - A list of followers.
   */
  async getUserFollowers(userId: number): Promise<PaginatedList<User>> {
    return this.getPaginatedList<User>(`user/${userId}/followers`);
  }

  /**
   * Get the followings for the given userId.
   *
   * @param {number} userId - The user id to get followings.
   * @returns {@link PaginatedList} of {@link User} - A list of followings.
   */
  async getUserFollowings(userId: number): Promise<PaginatedList<User>> {
    return this.getPaginatedList<User>(`user/${userId}/followings`);
  }

  /**
   * Get the favourites tracks for the given userId.
   *
   * @param {number} userId - The user id to get the favourite tracks.
   * @returns {@link PaginatedList} of {@link Track} - A list of tracks.
   */
  async getUserTracks(userId: number): Promise<PaginatedList<Track>> {
    return this.getPaginatedList<Track>(`user/${userId}/tracks`);
  }

  /**
   * Get the playlists for the given userId.
   *
   * @param {number} userId - The user id to get the playlists.
   * @returns {@link PaginatedList} of {@link Playlist} - A list of playlists.
   */
  async getUserPlaylists(userId: number): Promise<PaginatedList<Playlist>> {
    return this.getPaginatedList<Playlist>(`user/${userId}/playlists`);
  }

  // --------------------------------------------------

  /**
   * Get the podcasts for the given userId.
   *
   * @param {number} userId - The user id to get the podcasts.
   * @returns {@link PaginatedList} of {@link Podcast} - A list of podcasts.
   */
  async getUserPodcasts(userId: number): Promise<PaginatedList<Podcast>> {
    return this.getPaginatedList<Podcast>(`user/${userId}/podcasts`);
  }

  /**
   * Get the radios for the given userId.
   *
   * @param {number} userId - The user id to get the radios.
   * @returns {@link PaginatedList} of {@link Radio} - A list of radios.
   */
  async getUserRadios(userId: number): Promise<PaginatedList<Radio>> {
    return this.getPaginatedList<Radio>(`user/${userId}/radios`);
  }

  /**
   * Get the charts for the given userId.
   *
   * @param {number} userId - The user id to get the charts.
   * @returns {@link PaginatedList} of {@link Chart} - A list of charts.
   */
  async getUserCharts(userId: number): Promise<PaginatedList<Chart>> {
    return this.getPaginatedList<Chart>(`user/${userId}/charts`);
  }

  // --------------------------------------------------

  /**
   * @internal
   */
  private async _search<T extends Resource>(
    path: string,
    query: string = "",
    strict?: boolean,
    ordering?: string,
    advancedParams: Record<string, string | number | null> = {},
  ): Promise<PaginatedList<T>> {
    const optionalParams: Record<string, string> = {};

    if (strict === true) {
      optionalParams["strict"] = "on";
    }
    if (ordering) {
      optionalParams["ordering"] = ordering;
    }

    const queryParts: string[] = [];
    if (query) {
      queryParts.push(query);
    }

    Object.entries(advancedParams)
      .filter(([_, value]) => value !== null)
      .forEach(([paramName, paramValue]) => {
        queryParts.push(`${paramName}:"${paramValue}"`);
      });

    return this.getPaginatedList<T>(path ? `search/${path}` : "search", {
      q: queryParts.join(" "),
      ...optionalParams,
    });
  }

  /**
   * Search tracks.
   *
   * Advanced search is available by either formatting the query yourself or
   * by using the dedicated keywords arguments.
   *
   * @param {string} query - the query to search for, this is directly passed as q query.
   * @param {boolean} strict - whether to disable fuzzy search and enable strict mode.
   * @param {string} ordering - see Deezer API docs for possible values..
   * @param {Object} advancedParams - Additional parameters to pass.
   * @param {string} advancedParams.artist - The artist to search for
   * @param {string} advancedParams.album - The album to search for
   * @param {string} advancedParams.track - The track to search for
   * @param {string} advancedParams.label - The label to search for
   * @param {number} advancedParams.dur_min - The minimum duration of the track
   * @param {number} advancedParams.dur_max - The maximum duration of the track
   * @param {number} advancedParams.bpm_min - The minimum BPM of the track
   * @param {number} advancedParams.bpm_max - The maximum BPM of the track
   *
   * @returns {@link PaginatedList} of {@link Track} - A list of tracks.
   */
  async search(
    query: string = "",
    strict?: boolean,
    ordering?: string,
    advancedParams: {
      artist?: string;
      album?: string;
      track?: string;
      label?: string;
      dur_min?: number;
      dur_max?: number;
      bpm_min?: number;
      bpm_max?: number;
    } = {},
  ): Promise<PaginatedList<Track>> {
    return this._search<Track>("", query, strict, ordering, advancedParams);
  }

  /**
   * Search albums matching the given query.
   *
   * @param query - the query to search for, this is directly passed as q query.
   * @param strict - whether to disable fuzzy search and enable strict mode.
   * @param ordering - see Deezer API docs for possible values.
   */
  async searchAlbums(
    query: string = "",
    strict?: boolean,
    ordering?: string,
  ): Promise<PaginatedList<Album>> {
    return this._search<Album>("album", query, strict, ordering);
  }

  /**
   * Search artists matching the given query.
   *
   * @param query - the query to search for, this is directly passed as q query.
   * @param strict - whether to disable fuzzy search and enable strict mode.
   * @param ordering - see Deezer API docs for possible values.
   */
  async searchArtists(
    query: string = "",
    strict?: boolean,
    ordering?: string,
  ): Promise<PaginatedList<Artist>> {
    return this._search<Artist>("artist", query, strict, ordering);
  }

  /**
   * Search playlists matching the given query.
   *
   * @param query - the query to search for, this is directly passed as q query.
   * @param strict - whether to disable fuzzy search and enable strict mode.
   * @param ordering - see Deezer API docs for possible values.
   */
  async searchPlaylists(
    query: string = "",
    strict?: boolean,
    ordering?: string,
  ): Promise<PaginatedList<Playlist>> {
    return this._search<Playlist>("playlist", query, strict, ordering);
  }
}
