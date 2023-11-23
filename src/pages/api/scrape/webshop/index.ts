import { getSession } from 'next-auth/react';
import axios from 'axios';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: 'unauthorized' });
    if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
    if (!req?.body?.url) return res.status(400).json({ error: 'bad request' });
    let cms = null;
    let content = '';
    try {
        let axiosRes = await axios.get(`https://${req.body.url}`);
        content = axiosRes?.data;
        if (content.indexOf('woocommerce') !== -1) {
            cms = 'woocommerce';
        } else if (content.indexOf('shopify') !== -1) {
            cms = 'shopify';
        } else if (content.indexOf('magento') !== -1) {
            cms = 'magento';
        } else {
            return res.status(200).json({ error: 'unrecognized webshop' })
        }
    } catch (error) {
        if (error.message.indexOf('ENOTFOUND') !== -1) {
            return res.status(200).json({ error: 'not found' });
        } if (error.message.indexOf('ERR_INVALID_URL') !== -1) {
            return res.status(200).json({ error: 'invalid url' });
        }
    }
    const extractedData = content.length && cms ? (await import(`./extractors/${cms}.ts`)).default(content) : {};
    return res.status(200).json({
        cms,
        url: req.body.url,
        ...extractedData,
    });
}