import * as cheerio from 'cheerio';

const extract = (content) => {
    const $ = cheerio.load(content);
    const extractedData = {};
    return extractedData;
}

export default extract;