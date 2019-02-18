const { load } = require('cheerio');
const { get } = require('snekfetch');

const durationRegex = RegExp('(?:(\\d{1,2}):)?(\\d{1,2}):(\\d{2})');

/**
 * Searches YouTube for the specified query.
 * @param {String} query The query to search for.
 * @returns {Promise<Array<Result>, Error>} An array of results. Could be empty if nothing found.
 */
async function search (query, limit) {
  const data = await get(`https://youtube.com/results?search_query=${encodeURIComponent(query)}`);
  const $ = load(data.body.toString());

  const results = $('.yt-lockup-video')
    .filter((_, e) => !('data-ad-impressions' in e.attribs));

  const items = [];

  $(results).each((_, el) => {
    const selector = $(el);
    const info = selector.find('h3.yt-lockup-title a');
    const duration = selector.find('span.video-time').text();
    const durationMs = getDurationMs(duration);
    const uploader = selector.find('div.yt-lockup-byline a').text();
    const link = `https://youtube.com${info.attr('href')}`;

    items.push({
      title: info.text(),
      link,
      id: link.substring(link.indexOf('=') + 1),
      uploader,
      duration,
      durationMs
    });
  });

  if (limit && Number(limit)) {
    items.length = Number(limit);
  }

  return items;
}


/**
 * Converts a given time-string into milliseconds.
 * @param {String} timeString The string to convert to milliseconds.
 * @returns {(Number|Null)} Milliseconds if successful, otherwise null.
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

/**
 * @typedef {Object} Result
 * @property {String} title The title of the result.
 * @property {String} link The direct URL of the result.
 * @property {String} id The identifier of the video.
 * @property {String} uploader The name of the channel that uploaded the result.
 * @property {String} duration The humanized duration of the result.
 * @property {Number} durationMs The duration in milliseconds.
 */
