import { Client } from "../src/client";
import { Album } from "../src/resources/album";
import { Artist } from "../src/resources/artist";
import { Chart } from "../src/resources/chart";
import { Track } from "../src/resources/track";
import { Playlist } from "../src/resources/playlist";
import { DeezerErrorResponse } from "../src/exceptions";
import { PaginatedList } from "../src/pagination";
import { Editorial } from "../src/resources/editorial";
import { Episode } from "../src/resources/episode";
import { Genre } from "../src/resources/genre";
import { Podcast } from "../src/resources/podcast";
import { Radio } from "../src/resources/radio";
import { User } from "../src/resources/user";

describe("Client", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  // Test basic client get methods
  describe("getAlbum", () => {
    it("should retrieve an album", async () => {
      const album = await client.getAlbum(302127);
      expect(album).toBeInstanceOf(Album);
      expect(album.id).toBe(302127);
    });

    it("should throw DeezerErrorResponse for invalid album id", async () => {
      await expect(client.getAlbum(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getArtist", () => {
    it("should retrieve an artist", async () => {
      const artist = await client.getArtist(27); // Daft Punk
      expect(artist).toBeInstanceOf(Artist);
      expect(artist.id).toBe(27);
      expect(artist.name).toBe("Daft Punk");
    });

    it("should throw DeezerErrorResponse for invalid artist id", async () => {
      await expect(client.getArtist(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getEditorial", () => {
    it("should retrieve an editorial", async () => {
      const editorial = await client.getEditorial(0); // Main editorial
      expect(editorial).toBeInstanceOf(Editorial);
      expect(editorial.id).toBe(0);
    });

    it("should throw DeezerErrorResponse for invalid editorial id", async () => {
      await expect(client.getEditorial(-1)).rejects.toThrow(
        DeezerErrorResponse,
      );
    });
  });

  describe("getEpisode", () => {
    it("should retrieve an episode", async () => {
      // First get a podcast to find a valid episode
      const podcast = await client.getPodcast(699612);
      const episodes = await podcast.getEpisodes();
      const firstEpisode = await episodes.get(0);

      const episode = await client.getEpisode(firstEpisode.id);
      expect(episode).toBeInstanceOf(Episode);
      expect(episode.id).toBe(firstEpisode.id);
    });

    it("should throw DeezerErrorResponse for invalid episode id", async () => {
      await expect(client.getEpisode(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getGenre", () => {
    it("should retrieve a genre", async () => {
      const genre = await client.getGenre(106); // Electro
      expect(genre).toBeInstanceOf(Genre);
      expect(genre.id).toBe(106);
    });

    it("should throw DeezerErrorResponse for invalid genre id", async () => {
      await expect(client.getGenre(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getPlaylist", () => {
    it("should retrieve a playlist", async () => {
      const playlist = await client.getPlaylist(908622995); // Sample playlist
      expect(playlist).toBeInstanceOf(Playlist);
      expect(playlist.id).toBe(908622995);
    });

    it("should throw DeezerErrorResponse for invalid playlist id", async () => {
      await expect(client.getPlaylist(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getPodcast", () => {
    it("should retrieve a podcast", async () => {
      const podcast = await client.getPodcast(699612); // Sample podcast
      expect(podcast).toBeInstanceOf(Podcast);
      expect(podcast.id).toBe(699612);
    });

    it("should throw DeezerErrorResponse for invalid podcast id", async () => {
      await expect(client.getPodcast(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getRadio", () => {
    it("should retrieve a radio", async () => {
      const radio = await client.getRadio(6); // Deezer Hits
      expect(radio).toBeInstanceOf(Radio);
      expect(radio.id).toBe(6);
    });

    it("should throw DeezerErrorResponse for invalid radio id", async () => {
      await expect(client.getRadio(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getTrack", () => {
    it("should retrieve a track", async () => {
      const track = await client.getTrack(3135556);
      expect(track).toBeInstanceOf(Track);
      expect(track.id).toBe(3135556);
    });

    it("should throw DeezerErrorResponse for invalid track id", async () => {
      await expect(client.getTrack(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  describe("getUser", () => {
    it("should retrieve a user", async () => {
      const user = await client.getUser(2529); // Sample user
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(2529);
    });

    it("should throw DeezerErrorResponse for invalid user id", async () => {
      await expect(client.getUser(-1)).rejects.toThrow(DeezerErrorResponse);
    });
  });

  // Test a method that uses getRelation
  describe("Album.getArtist", () => {
    it("should get the artist of an album", async () => {
      const album = await client.getAlbum(302127);
      const artist = await album.getArtist();

      expect(artist).toBeInstanceOf(Artist);
      expect(artist.id).toBe(album.artist?.id);
    });
  });

  // Test a method that uses getPaginatedList
  describe("Album.getTracks", () => {
    it("should get paginated tracks of an album", async () => {
      const album = await client.getAlbum(302127);
      const tracks = await album.getTracks();

      expect(tracks).toBeInstanceOf(PaginatedList);

      // Test iteration
      const trackArray = await tracks.toArray();
      expect(trackArray.length).toBeGreaterThan(0);
      expect(trackArray[0]).toBeInstanceOf(Track);
    });

    it("should support pagination parameters", async () => {
      const album = await client.getAlbum(302127);
      const tracks = await album.getTracks({ limit: "2" });

      // Get first page
      const firstPage = await tracks.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await tracks.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different tracks
      expect(firstPage[0]!.id).not.toBe(secondPage[0]!.id);
      expect(firstPage[1]!.id).not.toBe(secondPage[1]!.id);
    });
  });

  // Test a complex response with multiple resource types
  describe("getChart", () => {
    it("should get overall chart", async () => {
      const chart = await client.getChart();

      expect(chart).toBeInstanceOf(Chart);
      expect(chart.id).toBe(0);

      // Test that all resource types are properly parsed
      expect(chart.tracks[0]).toBeInstanceOf(Track);
      expect(chart.albums[0]).toBeInstanceOf(Album);
      expect(chart.artists[0]).toBeInstanceOf(Artist);
      expect(chart.playlists[0]).toBeInstanceOf(Playlist);
    });

    it("should get chart for specific genre", async () => {
      const chart = await client.getChart(106);

      expect(chart).toBeInstanceOf(Chart);
      expect(chart.id).toBe(106);
      expect(chart.tracks.length).toBeGreaterThan(0);
    });
  });

  // Test search functionality with advanced parameters
  describe("search", () => {
    it("should search tracks with basic query", async () => {
      const results = await client.search("Daft Punk");
      expect(results).toBeInstanceOf(PaginatedList);

      const tracks = await results.toArray();
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks[0]).toBeInstanceOf(Track);
    });

    it("should search with advanced parameters", async () => {
      const results = await client.search("", true, undefined, {
        artist: "Daft Punk",
      });

      const tracks = await results.toArray();
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks[0]).toBeInstanceOf(Track);
    });

    it("should handle empty search results", async () => {
      const results = await client.search(
        "thisisaveryrandomsearchtermthatwontmatchanything123456789",
      );
      const tracks = await results.toArray();
      expect(tracks.length).toBe(0);
    });

    it("should handle search with duration filters", async () => {
      const results = await client.search("", false, undefined, {
        dur_min: 200,
        dur_max: 300,
      });

      const tracks = await results.toArray();
      expect(tracks.length).toBeGreaterThan(0);
      tracks.forEach((track) => {
        expect(track.duration).toBeGreaterThanOrEqual(200);
        expect(track.duration).toBeLessThanOrEqual(300);
      });
    });
  });

  // Test specialized search methods
  describe("searchAlbums", () => {
    it("should search albums", async () => {
      const results = await client.searchAlbums("Daft Punk");
      expect(results).toBeInstanceOf(PaginatedList);

      const albums = await results.toArray();
      expect(albums.length).toBeGreaterThan(0);
      expect(albums[0]).toBeInstanceOf(Album);
      expect(albums[0]!.title.toLowerCase()).toContain("discovery"); // Most popular Daft Punk album
    });

    it("should support strict mode", async () => {
      const results = await client.searchAlbums("Discovery", true);
      const albums = await results.toArray();
      expect(albums.length).toBeGreaterThan(0);
      expect(albums[0]).toBeInstanceOf(Album);
    });
  });

  describe("searchArtists", () => {
    it("should search artists", async () => {
      const results = await client.searchArtists("Daft Punk");
      expect(results).toBeInstanceOf(PaginatedList);

      const artists = await results.toArray();
      expect(artists.length).toBeGreaterThan(0);
      expect(artists[0]).toBeInstanceOf(Artist);
      expect(artists[0]!.name).toBe("Daft Punk");
    });
  });

  describe("searchPlaylists", () => {
    it("should search playlists", async () => {
      const results = await client.searchPlaylists("Daft Punk");
      expect(results).toBeInstanceOf(PaginatedList);

      const playlists = await results.toArray();
      expect(playlists.length).toBeGreaterThan(0);
      expect(playlists[0]).toBeInstanceOf(Playlist);
      expect(playlists[0]!.title.toLowerCase()).toContain("daft punk");
    });
  });

  // Test chart-specific methods
  describe("getTracksChart", () => {
    it("should get overall tracks chart", async () => {
      const tracks = await client.getTracksChart();
      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks[0]).toBeInstanceOf(Track);
    });

    it("should get genre-specific tracks chart", async () => {
      const tracks = await client.getTracksChart(106); // Electro genre
      expect(Array.isArray(tracks)).toBe(true);
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks[0]).toBeInstanceOf(Track);
    });
  });

  describe("getAlbumsChart", () => {
    it("should get overall albums chart", async () => {
      const albums = await client.getAlbumsChart();
      expect(Array.isArray(albums)).toBe(true);
      expect(albums.length).toBeGreaterThan(0);
      expect(albums[0]).toBeInstanceOf(Album);
    });
  });

  describe("getArtistsChart", () => {
    it("should get overall artists chart", async () => {
      const artists = await client.getArtistsChart();
      expect(Array.isArray(artists)).toBe(true);
      expect(artists.length).toBeGreaterThan(0);
      expect(artists[0]).toBeInstanceOf(Artist);
    });
  });

  describe("getPlaylistsChart", () => {
    it("should get overall playlists chart", async () => {
      const playlists = await client.getPlaylistsChart();
      expect(Array.isArray(playlists)).toBe(true);
      expect(playlists.length).toBeGreaterThan(0);
      expect(playlists[0]).toBeInstanceOf(Playlist);
    });
  });

  describe("getPodcastsChart", () => {
    it("should get overall podcasts chart", async () => {
      const podcasts = await client.getPodcastsChart();
      expect(Array.isArray(podcasts)).toBe(true);
      expect(podcasts.length).toBeGreaterThan(0);
      expect(podcasts[0]).toBeInstanceOf(Podcast);
    });
  });
});
