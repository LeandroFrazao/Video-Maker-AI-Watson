const readline = require("readline-sync");
const robots = {
  userInput: require("./robots/user-input.js"),
  text: require("./robots/text.js"),
};

const Parser = require("rss-parser");

async function start() {
  const content = {};

  content.searchTerm = await askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  robots.userInput(content);
  await robots.text(content);

  async function askAndReturnSearchTerm() {
    const searchType = await askAndReturnSearchType();
    const response =
      searchType === "Any Term"
        ? readline.question("Type any term: ")
        : searchType === "Google Trends"
        ? await askAndReturnGoogleTrend()
        : searchType === "IMDB Trends"
        ? await askAndReturnIMDBTrend()
        : null;

    return response;
  }

  async function askAndReturnSearchType() {
    const searchType = ["Any Term", "Google Trends", "IMDB Trends"];
    const selectedSearchTypeIndex = readline.keyInSelect(searchType, "Choose an Option: ");
    const selectedSearchTypeText = searchType[selectedSearchTypeIndex];

    return selectedSearchTypeText;
  }

  async function askAndReturnGoogleTrend() {
    console.log("Please wait...");
    const trends = await getGoogleTrends();
    const trendChoice = readline.keyInSelect(trends, "Choose a trend:");

    return trends[trendChoice];
  }

  async function getGoogleTrends() {
    const TREND_URL = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR";
    const parser = new Parser();
    const trends = await parser.parseURL(TREND_URL);

    return trends.items.map((items) => items.title);
  }

  async function askAndReturnIMDBTrend() {
    console.log("Please wait...");
    const trends = await getIMDBTrends();
    const trendChoice = readline.keyInSelect(trends, "Choose a trend:");

    return trends[trendChoice];
  }

  async function getIMDBTrends() {
    const { getTrending } = require("imdb-scrapper");
    const numberOfMovies = 10;
    const response = await getTrending(numberOfMovies).then((movies) => movies.trending.map((movie) => movie.name));

    return response;
  }

  function askAndReturnPrefix() {
    const prefixes = ["Who is", "What is", "The history of"];
    const selectedPrefixIndex = readline.keyInSelect(prefixes, "Choose an option for " + content.searchTerm + ": ");
    const selectedPrefixText = prefixes[selectedPrefixIndex];

    return selectedPrefixText;
  }
  //  console.log(content);
}

start();
