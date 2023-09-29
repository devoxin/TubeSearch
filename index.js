const fetch = require('node-fetch');

const INNERTUBE_KEY = 'AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w';
const INNERTUBE_CLIENT_CONFIG = {
  context: {
    client: {
      clientName: 'ANDROID',
      clientVersion: '17.29.34',
      androidSdkVersion: 30
    }
  }
}


/**
 * Searches YouTube for the specified query.
 * @param {String} query The query to search for.
 * @param {Number} limit The maximum amount of videos to return.
 * @returns {Promise<Array<Video>, Error>} An array of videos. Could be empty if nothing found.
 */
async function search (query, limit) {
  const data = await fetch(`https://youtubei.googleapis.com/youtubei/v1/search?key=${INNERTUBE_KEY}`, {
    method: 'post',
    body: JSON.stringify({
      ...INNERTUBE_CLIENT_CONFIG,
      query,
      params: 'EgIQAQ=='
    }),
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.json());

  const results = data.contents
    .sectionListRenderer
    .contents
    .filter(item => !!item.itemSectionRenderer)
    .flatMap(item => item.itemSectionRenderer.contents)
    .filter(Boolean)
    .map(extractSearchResult)

  if (limit && Number(limit)) {
    results.length = Number(limit);
  }

  return results;
}

function extractSearchResult (item) {
  const details = item.compactVideoRenderer;

  if (!details) {
    return undefined;
  }

  const isLiveStream = !details.lengthText;
  const duration = isLiveStream ? 'LIVE' : details.lengthText.runs[0].text;

  return {
    id: details.videoId,
    title: details.title.runs[0].text,
    uploader: details.longBylineText.runs[0].text,
    duration,
    durationMs: isLiveStream ? -1 : getDurationMs(duration),
    link: `https://www.youtube.com/watch?v=${details.videoId}`,
    isLiveStream
  }
}

/**
 * Retrieves the videos of the playlist with the given identifier.
 * Limited to the first 'page' returned by YouTube.
 * @param {String} identifier The playlist's unique identifier.
 * @param {Number} limit The maximum amount of videos to return.
 * @returns {Promise<Array<PlaylistVideo>, Error>} An array of videos. Could be empty if nothing found.
 */
async function playlist (identifier, limit) {
  const data = await fetch(`https://youtubei.googleapis.com/youtubei/v1/browse`, {
    method: 'post',
    body: JSON.stringify({
      ...INNERTUBE_CLIENT_CONFIG,
      browseId: 'VL' + identifier,
    }),
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.json());

  const playlistVideoList = data.contents
    .singleColumnBrowseResultsRenderer
    .tabs[0]
    .tabRenderer
    .content
    .sectionListRenderer
    .contents[0]
    .playlistVideoListRenderer
    .contents;

  if (!playlistVideoList) {
    return [];
  }

  const results = playlistVideoList.filter(item => !!item.playlistVideoRenderer)
    .filter(item => !!item.playlistVideoRenderer.isPlayable)
    .filter(item => !!item.playlistVideoRenderer.shortBylineText)
    .map(extractPlaylistVideo)

  if (limit && Number(limit)) {
    results.length = Number(limit);
  }

  return results;
}

function extractPlaylistVideo (item) {
  const details = item.playlistVideoRenderer;

  return {
    id: details.videoId,
    title: details.title.simpleText || details.title.runs[0].text,
    uploader: details.shortBylineText.runs[0].text,
    durationMs: details.lengthSeconds ? (details.lengthSeconds * 1000) : -1,
    link: `https://www.youtube.com/watch?v=${details.videoId}`
  }
}

/**
 * Converts a given time-string into milliseconds.
 * @param {String} timeString The string to convert to milliseconds.
 * @returns {Number} Milliseconds if successful, otherwise null.
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
 * @property {String} duration The humanized duration of the video. Can be "" for livestreams.
 * @property {Number} durationMs The duration in milliseconds. Can be -1 for livestreams.
 * @property {Boolean} isLiveStream Whether the video is a livestream.
 */

/**
 * @typedef {Object} PlaylistVideo
 * @property {String} title The title of the video.
 * @property {String} link The direct URL to the video.
 * @property {String} id The identifier of the video.
 * @property {String} uploader The name of the channel that uploaded the video.
 * @property {Number} durationMs The duration in milliseconds. Can be -1 for livestreams.
 */
