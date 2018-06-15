const { load } = require('cheerio');
const { get } = require('snekfetch');

async function search (query) {
  const data = await get(`https://youtube.com/results?search_query=${encodeURIComponent(query)}`);
  const $ = load(data.body.toString());

  const results = $('.yt-lockup-video')
    .filter((i, e) => !('data-ad-impressions' in e.attribs));

  const items = [];

  const videos = $(results).each((i, el) => {
    const info = $(el).find('h3.yt-lockup-title a');
    const link = info.attr('href');

    items.push({
      title: info.text(),
      id: link.substring(link.indexOf('=') + 1)
    });
  });

  return items;
}

module.exports = search;
