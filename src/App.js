import { useEffect, useState } from "react";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-js";
import SpotifyPlayer from "react-spotify-web-playback";

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
  const search = window.location.hash.substring(1); // 쿼리 부분 가져오기
  const params = new URLSearchParams(search); // URLSearchParams 객체 생성
  let accessToken = params.toString().split("=");
  accessToken = accessToken[1].split("&")[0];
  console.log(accessToken);
  return accessToken;
};

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [newPlaying, setNewPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (window.location.hash.substring(1)) {
      console.log("this is what we derived from url", getTokenFromUrl());
      const spotifyToken = getTokenFromUrl();
      // window.location.hash = "";
      console.log(spotifyToken);
      if (spotifyToken) {
        setSpotifyToken(spotifyToken);
        spotifyApi.setAccessToken(spotifyToken);
        spotifyApi.getMe().then((user) => {
          // console.log(user);
        });
        // use spotify api
        setLoggedIn(true);
      }
    }
  });

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      console.log(response);
      spotifyApi
        .getCategories("spotify:track:4lKWSv9JLE8B1YINRFv42O")
        .then((response) => {
          console.log(response);
        });
      setNewPlaying({
        name: response.item.name,
        albumArt: response.item.album.images[0].url,
      });
    });
  };

  return (
    <div className="App">
      {!loggedIn && <a href="http://localhost:8888">Login to spotify</a>}
      {loggedIn && (
        <SpotifyPlayer
          token={spotifyToken}
          uris={["spotify:album:6Z1zv6Hw9bdvSoxI5uYk2h"]}
          styles={{
            activeColor: "#fff",
            bgColor: "#333",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#1cb954",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
        />
      )}
      {loggedIn && (
        <>
          <div>Now Playing {newPlaying.name}</div>
          <div>
            <img src={newPlaying.albumArt} style={{ height: 150 }} />
          </div>
        </>
      )}
      {loggedIn && (
        <button onClick={() => getNowPlaying()}>Get Now Playing</button>
      )}
    </div>
  );
}

export default App;
