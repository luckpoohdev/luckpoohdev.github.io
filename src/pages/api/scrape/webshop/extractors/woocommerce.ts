import * as cheerio from 'cheerio';

const extract = (content) => {
    const $ = cheerio.load(content);
    const extractedData = {
        name: $('meta[property="og:site_name"]').attr('content') ?? $('title').html()?.split(' – ')?.[0],
        gateway: content.match(/reepay/g)?.[0],
        third_parties: [...new Set(content.match(/viabill|mobile pay/g))],
    };
    return extractedData;
}

export default extract;