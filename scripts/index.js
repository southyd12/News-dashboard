const dateTimeDisplay = document.getElementById("date-time");
const dateDisplay = dateTimeDisplay.querySelector("#date");
const timeDisplay = dateTimeDisplay.querySelector("#time");
const newsDisplay = document.getElementById("news");
const catsFactDisplay = document.getElementById("cats");
const jokesDisplay = document.getElementById("jokes");

/***********************************************************
 * Clock
 ***********************************************************/

let today = new Date();

function getFormattedDate(dateobj, format = "en-GB") {
  return dateobj.toLocaleDateString(
    format, // locale
    {
      // options
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}

dateDisplay.textContent = getFormattedDate(today);

function getFormattedTime(
  dateobj,
  format = "en-GB",
  options = { hour: "2-digit", minute: "2-digit", second: "2-digit" }
) {
  return dateobj.toLocaleTimeString(
    format, // locale
    options
  );
}

function tick() {
  const time = new Date();
  timeDisplay.innerText = getFormattedTime(time);

  // Only update date if dates are not equal
  if (time.getDate() !== today.getDate()) {
    today = time;
    dateDisplay.textContent = getFormattedDate(today);
  }
}

tick();
setInterval(tick, 1000);

/***********************************************************
 * DOM Utils
 ***********************************************************/

function showSpinner(area) {
  area.innerHTML = `<div class="text-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
}

function showError(area, message) {
  area.innerHTML = `<p>${message}</p>`;
}


/***********************************************************
 * News (https://open-platform.theguardian.com/)
 ***********************************************************/
const newsAPIKey = `6de65409-e9fd-41f0-8271-0817ae1a356e`;
const newsRegion = `uk`;
const newsOrder = `newest`;
const newsPage = '1';
const newsThumbnail = 'thumbnail';
const newsAPIEndpoint = `https://content.guardianapis.com/search?q=${newsRegion}&api-key=${newsAPIKey}&order-by=${newsOrder}&pages=${newsPage}&show-fields=${newsThumbnail}`;


async function latestNews(area = newsDisplay, renderNews = () => {}) {
  showSpinner(area);

  try {
    const response = await fetch(newsAPIEndpoint);
    if (!response.ok) throw response;
    const newsData = await response.json();
    console.log(`newsData`, newsData.response.results);
    const finalNewsData = newsData.response.results
    renderNews(finalNewsData);
  } catch (err) {
    showError(area, err.statusText || err.message);
  }
}

function renderNews(finalNewsData = {}, area = newsDisplay) {
  // const {response} = newsData;
  const newsList = document.createElement("div");
  newsList.innerHTML = `<h2 style="padding: 0.5em">Latest News</h2>`;
  let i = 9;
  while (i >= 0) {
    newsList.innerHTML += `<li style="margin: 3em; list-style-type: none; display: flex; justify-content: center; flex-direction: column; align-items: center;"><img src='${finalNewsData[i].fields.thumbnail}' style="max-width:600px; height:auto; min-width: 400px;"/><div style="font-size: large; font-weight: bold;">${finalNewsData[i].webTitle}</div></li>`;
    i -= 1;
    
}
  // finalNewsData.reverse();
  area.replaceChildren(newsList);
}

latestNews(newsDisplay, renderNews);


/***********************************************************
 * Cat facts (https://meowfacts.herokuapp.com/)
 ***********************************************************/
async function catFacts(area = catsFactDisplay, renderCats = () => {}) {
  showSpinner(area);

  try {
    const response = await fetch(`https://meowfacts.herokuapp.com/?count=3`);
    if (!response.ok) throw response;
    const {data} = await response.json();
    console.log(`data`, data);
    renderCats(data);
  } catch (err) {
    showError(area, err.statusText || err.message);
  }
}

function renderCats(data = {}, area = catsFactDisplay) {
  const factList = document.createElement("div");
  factList.innerHTML = `<h2 style="text-align: center; padding: 0.5em">3 Random Cat Facts</h2><ol><li style="margin: 1em">${data[0]}</li><li style="margin: 1em">${data[1]}</li><li style="margin: 1em">${data[2]}</li></ol>`;
  area.replaceChildren(factList);
}

catFacts(catsFactDisplay, renderCats);


/******************/

/***********************************************************
 * Jokes (https://api.sampleapis.com/jokes/goodJokes)
 ***********************************************************/

async function jokes(area = jokesDisplay, renderJokes = () => {}) {
  showSpinner(area);

try {
  const response = await fetch(`https://api.sampleapis.com/jokes/goodJokes`);
  if (!response.ok) throw response;
  const jokesData = await response.json();
  console.log(`jokesData`, jokesData);
  renderJokes(jokesData);
} catch (err) {
  showError(area, err.statusText || err.message);
}
}

function renderJokes(jokesData = {}, area = jokesDisplay) {
 
  const characterList = document.createElement("div");
  characterList.innerHTML = `<h2 style="text-align: center; padding: 0.5em">Jokes of the Day</h2>`;

  let indexes = new Set();

  while(indexes.size < 3){
    const random = Math.floor(Math.random() * jokesData.length);
    indexes.add(random);
  }

  for (const index of indexes) {
     characterList.innerHTML += `<li style="margin: 1em">QUESTION: ${jokesData[index].setup} ANSWER: ${jokesData[index].punchline}</li>`; // <-- note the +=
  }

  area.replaceChildren(characterList);
}

jokes(jokesDisplay, renderJokes);