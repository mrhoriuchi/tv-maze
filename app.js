"use strict";

const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list");

async function getShowsByTerm(term) {
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  return res.data.map((result) => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
}

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="card media">
           <img src=${show.image} alt="${show.name}" class="w-25 mr-3 card-body">
           <div class="card-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($show);
  }
}

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  return res.data.map((result) => ({
    id: result.id,
    name: result.name,
    season: result.season,
    number: result.number,
  }));
}

function populateEpisodes(episodes) {
  $episodesArea.show();
  $episodesList.empty();
  for (let episode of episodes) {
    const $item = $(
      `<li>
         ${episode.name} (season ${episode.season}, episode ${episode.number})
       </li>
      `
    );

    $episodesList.append($item);
  }
}

async function getEpisodesAndDisplay(e) {
  const showId = $(e.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
