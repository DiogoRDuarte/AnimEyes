function buildQuery(page, seasonYear) {
  const yearFilter = seasonYear ? `, seasonYear: ${seasonYear}` : '';
  return `
query {
  Page(page: ${page}, perPage: 50) {
    media(sort: SCORE_DESC, type: ANIME, isAdult: false, format: TV${yearFilter}) {
      id
      title { romaji }
      genres
      seasonYear
      season
      episodes
      popularity
      rankings { rank type }
      averageScore
      coverImage { large }
      siteUrl
      startDate { year month day }
      endDate { year month day }
    }
  }
}
`;
}

const ratingMap = {
  'Action': 'R - 17+ (violence & profanity)',
  'Adventure': 'PG-13 - Teens 13 or older',
  'Comedy': 'PG-13 - Teens 13 or older',
  'Drama': 'PG-13 - Teens 13 or older',
  'Fantasy': 'PG-13 - Teens 13 or older',
  'Horror': 'R - 17+ (violence & profanity)',
  'Mystery': 'PG-13 - Teens 13 or older',
  'Romance': 'PG-13 - Teens 13 or older',
  'Sci-Fi': 'PG-13 - Teens 13 or older',
  'Thriller': 'R - 17+ (violence & profanity)',
  'Supernatural': 'PG-13 - Teens 13 or older',
  'Sports': 'PG - Children',
  'Music': 'G - All Ages',
  'Slice of Life': 'PG - Children',
  'Mecha': 'PG-13 - Teens 13 or older',
  'Psychological': 'R - 17+ (violence & profanity)',
};

function formatDate(d) {
  if (!d || !d.year) return 'N/A';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[(d.month || 1) - 1]} ${d.day || '?'}, ${d.year}`;
}

function formatSeason(season, year) {
  if (!season || !year) return 'Unknown';
  const s = season.charAt(0) + season.slice(1).toLowerCase();
  return `${s} ${year}`;
}

function guessRating(genres) {
  for (const g of genres) {
    if (ratingMap[g]) return ratingMap[g];
  }
  return 'PG-13 - Teens 13 or older';
}

function mapMedia(media, rankOffset) {
  return media.map((m, i) => {
    const aired = `${formatDate(m.startDate)} to ${formatDate(m.endDate)}`;
    const premiered = formatSeason(m.season, m.seasonYear);
    const genreStr = m.genres.length ? m.genres.join(', ') : 'Unknown';
    return {
      uid: m.id,
      title: m.title.romaji,
      genre: genreStr,
      aired,
      episodes: m.episodes || 0,
      members: m.popularity || 0,
      popularity: m.popularity || 0,
      ranked: rankOffset + i + 1,
      score: m.averageScore ? m.averageScore / 10 : 0,
      img_url: m.coverImage.large,
      link: m.siteUrl,
      premiered,
      rating: guessRating(m.genres),
    };
  });
}

export async function fetchTopAnime(year) {
  const url = 'https://graphql.anilist.co';
  const opts = (q) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q }),
  });

  const [res1, res2] = await Promise.all([
    fetch(url, opts(buildQuery(1, year))),
    fetch(url, opts(buildQuery(2, year))),
  ]);

  const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

  const page1 = mapMedia(data1.data.Page.media, 0);
  const page2 = mapMedia(data2.data.Page.media, 50);

  return [...page1, ...page2];
}
