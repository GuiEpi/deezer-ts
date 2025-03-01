import { Client } from "../../src/client";
import { User } from "../../src/resources/user";
import { Album } from "../../src/resources/album";
import { Artist } from "../../src/resources/artist";
import { Playlist } from "../../src/resources/playlist";
import { PaginatedList } from "../../src/pagination";

describe("User", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const user = await client.getUser(2529);

      // Basic properties
      expect(user.id).toBe(2529);
      expect(user.name).toBeDefined();
      expect(user.type).toBe("user");

      // Pictures
      expect(user.picture).toMatch(/^https?:\/\//);
      expect(user.picture_small).toMatch(/^https?:\/\//);
      expect(user.picture_medium).toMatch(/^https?:\/\//);
      expect(user.picture_big).toMatch(/^https?:\/\//);
      expect(user.picture_xl).toMatch(/^https?:\/\//);

      // Optional properties that should exist for this user
      expect(user.country).toBeDefined();
      expect(user.tracklist).toMatch(/^https?:\/\//);
    });
  });

  describe("getAlbums", () => {
    it("should get user albums", async () => {
      const user = await client.getUser(2529);
      const albums = await user.getAlbums();

      expect(albums).toBeInstanceOf(PaginatedList);

      const firstPage = await albums.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Album);
    });

    it("should support pagination", async () => {
      const user = await client.getUser(2529);
      const albums = await user.getAlbums({ limit: "2" });

      // Get first page
      const firstPage = await albums.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await albums.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different albums
      expect(firstPage[0]!.id).not.toBe(secondPage[0]!.id);
      expect(firstPage[1]!.id).not.toBe(secondPage[1]!.id);
    });
  });

  describe("getArtists", () => {
    it("should get user artists", async () => {
      const user = await client.getUser(2529);
      const artists = await user.getArtists();

      expect(artists).toBeInstanceOf(PaginatedList);

      const firstPage = await artists.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Artist);
    });
  });

  describe("getFollowers", () => {
    it("should get user followers", async () => {
      const user = await client.getUser(2529);
      const followers = await user.getFollowers();

      expect(followers).toBeInstanceOf(PaginatedList);

      const firstPage = await followers.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(User);
    });
  });

  describe("getFollowings", () => {
    it("should get user followings", async () => {
      const user = await client.getUser(2529);
      const followings = await user.getFollowings();

      expect(followings).toBeInstanceOf(PaginatedList);

      const firstPage = await followings.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(User);
    });
  });

  describe("getPlaylists", () => {
    it("should get user playlists", async () => {
      const user = await client.getUser(2529);
      const playlists = await user.getPlaylists();

      expect(playlists).toBeInstanceOf(PaginatedList);

      const firstPage = await playlists.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Playlist);
    });
  });
});
