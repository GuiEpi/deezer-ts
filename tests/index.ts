import { Client } from "../dist";

async function main() {
  const client = new Client();

  const album = await client.getAlbum(302127);
  // console.log("album :", album);
  if (album.tracks) {
    for (const track of album.tracks) {
      // console.log(track.title);
      // console.log(track.album.artist); // undefined
      const trackAlbum = track.album;
      // console.log(trackAlbum.title);
      const artist = await trackAlbum.getArtist();
      const artAlb = await artist.getAlbums();
      console.log(await artAlb.toArray());
      // console.log("total :", await artAlb.total());
      // console.log('Artiste :', artAlb);
      // const radio = await artist.getRadio();
      // for (const track of radio) {
      //   console.log(track.toJSON());
      //   break;
      // console.log(track.title);
      // for await (const alb of artAlb) {
      //   console.log(alb.title);
      // }
      break;
    }
  }
}

main();
