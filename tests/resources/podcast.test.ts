import { Client } from "../../src/client";
import { Podcast } from "../../src/resources/podcast";
import { Episode } from "../../src/resources/episode";
import { PaginatedList } from "../../src/pagination";

describe("Podcast", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client();
  });

  describe("properties", () => {
    it("should have all required properties", async () => {
      const podcast = await client.getPodcast(699612);

      // Basic properties
      expect(podcast.id).toBe(699612);
      expect(podcast.title).toBeDefined();
      expect(podcast.type).toBe("podcast");

      // Pictures
      expect(podcast.picture).toMatch(/^https?:\/\//);
      expect(podcast.picture_small).toMatch(/^https?:\/\//);
      expect(podcast.picture_medium).toMatch(/^https?:\/\//);
      expect(podcast.picture_big).toMatch(/^https?:\/\//);
      expect(podcast.picture_xl).toMatch(/^https?:\/\//);

      // Other required properties
      expect(podcast.description).toBeDefined();
      expect(podcast.available).toBeDefined();
      expect(podcast.fans).toBeGreaterThan(0);
      expect(podcast.link).toMatch(/^https?:\/\//);
      expect(podcast.share).toMatch(/^https?:\/\//);
    });
  });

  describe("getEpisodes", () => {
    it("should get podcast episodes", async () => {
      const podcast = await client.getPodcast(699612);
      const episodes = await podcast.getEpisodes();

      expect(episodes).toBeInstanceOf(PaginatedList);

      const firstPage = await episodes.slice(0, 2);
      expect(firstPage.length).toBe(2);
      expect(firstPage[0]).toBeInstanceOf(Episode);
      expect(firstPage[0]!.podcast.id).toBe(podcast.id);
    });

    it("should support pagination", async () => {
      const podcast = await client.getPodcast(699612);
      const episodes = await podcast.getEpisodes({ limit: "2" });

      // Get first page
      const firstPage = await episodes.slice(0, 2);
      expect(firstPage.length).toBe(2);

      // Get second page
      const secondPage = await episodes.slice(2, 4);
      expect(secondPage.length).toBe(2);

      // Verify we got different episodes
      expect(firstPage[0]!.id).not.toBe(secondPage[0]!.id);
      expect(firstPage[1]!.id).not.toBe(secondPage[1]!.id);
    });
  });
});
