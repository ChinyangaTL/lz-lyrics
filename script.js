const form = document.getElementById("form");
const search = document.getElementById("search");
const pagination = document.getElementById("pagination");
const pillToggle = document.getElementById("toggle");
const body = document.body;
const searchResults = document.getElementById("search-results");

// LIGHTMODE TOGGLE
pillToggle.addEventListener("change", () => {
  body.classList.toggle("lightmode");
});

const url = "https://api.lyrics.ovh";

async function findResults(searchString) {
  let results = await fetch(`${url}/suggest/${searchString}`);
  let data = await results.json();
  //   console.log(data);
  displayData(data);
}

function displayData(data) {
  let songs = "";

  data.data.forEach((song) => {
    songs += `
        <div class="card">
            <div class="album-art">
              <img src="${song.album.cover_big}" alt="album conver" />
            </div>
            <div class="info">
              <p>Title: ${song.title}</p>
              <p>Artist: ${song.artist.name}</p>
              <p>Album: ${song.album.title}</p>
              <a class="open-lyrics" data-artist="${song.artist.name}" data-title="${song.title}"></a>
            </div>
        </div>
        `;

    searchResults.innerHTML = `${songs}`;
  });

  if (data.next || data.prev) {
    pagination.innerHTML = `
        ${
          data.prev
            ? `<button class='button' onclick="getMore('${data.prev}')">Prev</button>`
            : ""
        }
      
      ${
        data.next
          ? `<button class='button' onclick="getMore('${data.next}')">Next</button>`
          : ""
      }`;
  } else {
    pagination.innerHTML = "";
  }
}

async function getLyrics(artist, title) {
  const result = await fetch(`${url}/v1/${artist}/${title}`);
  const data = await result.json();

  let results2 = await fetch(`${url}/suggest/${title}`);
  let fullData = await results2.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  const songInfo = fullData.data[0];
  //   console.log(songInfo);

  searchResults.innerHTML = `
      <div class="lyric-container">
          <p>
              ${lyrics}
          </p>
      </div>
  
      <div class="info-container">
          <div class="cover-art">
            <img src="${songInfo.album.cover_big}" alt="" />
          </div>
          <p
            class="song-title"
            style="
              text-align: center;
              font-family: Raleway;
              font-size: 1.5rem;
              text-transform: lowercase;
            "
          >
            ${songInfo.title}
          </p>
          <p style="text-align: center; margin-top: 0.2rem">${songInfo.artist.name}</p>
          <div class="other-info">
            <p class="album-name">Album name - ${songInfo.album.title}</p>
            <p class="duration">Duration - ${(
              Number(songInfo.duration) / 60
            ).toFixed(0)}:${
    Number(songInfo.duration) % 60 < 9
      ? "0" + (Number(songInfo.duration) % 60)
      : Number(songInfo.duration) % 60
  }</p>
            <p class="explicit ${
              songInfo.explicit_lyrics ? "yes" : "no"
            } yes">Explicit Lyrics: ${songInfo.explicit_lyrics ? "Yes" : "No"}
              </p>
              <a href="${
                songInfo.link
              }"><i class="fab fa-deezer"></i>Listen Now</a>    
          </div>
      </div>
    `;
}

async function getMore(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  displayData(data);
}

form.addEventListener("click", (e) => {
  e.preventDefault();

  const searchString = search.value.trim();
  findResults(searchString);
});

searchResults.addEventListener("click", (e) => {
  //   console.log(e.target);
  const artist = e.target.getAttribute("data-artist");
  const title = e.target.getAttribute("data-title");

  getLyrics(artist, title);
});
