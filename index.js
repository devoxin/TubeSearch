const { load } = require('cheerio');
const { get } = require('snekfetch');

const durationRegex = RegExp('(?:(\\d{1,2}):)?(\\d{1,2}):(\\d{2})');

/**
 * Searches YouTube for the specified query
 * @param {string} query The query to search for
 * @returns {Promise<Array<Object>, Error>} An array of results. Could be empty if nothing found
 */
async function search (query) {
  const data = await get(`https://youtube.com/results?search_query=${encodeURIComponent(query)}`);
  const $ = load(data.body.toString());

  const results = $('.yt-lockup-video')
    .filter((i, e) => !('data-ad-impressions' in e.attribs));

  const items = [];

  const videos = $(results).each((i, el) => {
    const info = $(el).find('h3.yt-lockup-title a');
    const duration = $(el).find('span.video-time').text();
    const durationMs = getDurationMs(duration);
    const uploader = $(el).find('div.yt-lockup-byline a').text();
    const link = `https://www.youtube.com${info.attr('href')}`;

    items.push({
      title: info.text(),
      link,
      id: link.substring(link.indexOf('=') + 1),
      uploader,
      duration,
      durationMs
    });
  });

  return items;
}


/**
 * Converts a given time-string into milliseconds
 * @param {string} timeString The string to convert to milliseconds
 * @returns {(Number|Null)} Milliseconds if successful, otherwise null
 */
function getDurationMs (timeString) {
  const match = durationRegex.exec(timeString);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]) || 0;
  const minutes = Number(match[2]) || 0;
  const seconds = Number(match[3]) || 0;

  const ms = (hours * 3600000) + (minutes * 60000) + (seconds * 1000); // eslint-disable-line

  return ms;
}

module.exports = search;
