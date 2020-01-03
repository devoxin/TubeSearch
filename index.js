const { load } = require('cheerio');
const fetch = require('node-fetch');


/**
 * Searches YouTube for the specified query.
 * @param {String} query The query to search for.
 * @param {Number} limit The maximum amount of videos to return.
 * @returns {Promise<Array<Video>, Error>} An array of videos. Could be empty if nothing found.
 */
async function search (query, limit) {
  const data = await fetch(`https://youtube.com/results?search_query=${encodeURIComponent(query)}`)
    .then(res => res.text());
  const $ = load(data);

  const results = $('.yt-lockup-video')
    .filter((_, e) => !('data-ad-impressions' in e.attribs));

  const items = [];

  results.each((_, el) => {
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
 * Retrieves the videos of the playlist with the given identifier.
 * Limited to the first 100 videos.
 * @param {String} identifier The playlist's unique identifier.
 * @param {Number} limit The maximum amount of videos to return.
 * @returns {Promise<Array<Video>, Error>} An array of videos. Could be empty if nothing found.
 */
async function playlist (identifier, limit) {
  const data = await fetch(`https://youtube.com/playlist?list=${identifier}`)
    .then(res => res.text());
  const $ = load(data);

  const results = $('.pl-video')
  const items = [];

  results.each((_, el) => {
    const selector = $(el);
    const info = selector.find('.pl-video-title-link');
    const duration = selector.find('.pl-video-time .timestamp').text();
    const durationMs = getDurationMs(duration);
    const uploader = selector.find('.pl-video-owner a').text();
    const link = `https://youtube.com${info.attr('href')}`;

    items.push({
      title: info.text().trim(),
      link,
      id: link.substring(link.indexOf('=') + 1, link.indexOf('&')),
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
  const parts = timeString.split(':').map(Number);

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return (minutes * 60000) + (seconds * 1000);
  } else {
    throw new Error(`Unexpected amount of parts in timeString, expected 2-3 but got ${parts.length}`);
  }
}

module.exports = {
  playlist,
  search
};

/**
 * @typedef {Object} Video
 * @property {String} title The title of the video.
 * @property {String} link The direct URL to the video.
 * @property {String} id The identifier of the video.
 * @property {String} uploader The name of the channel that uploaded the video.
 * @property {String} duration The humanized duration of the video.
 * @property {Number} durationMs The duration in milliseconds.
 */
