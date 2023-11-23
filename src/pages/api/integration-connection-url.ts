import { getSession } from 'next-auth/react';
import axios from 'axios';

import mergeIntoString from '../../utils/mergeIntoString';

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
        return;
    }
    const session = await getSession({ req });
    if (!session || !session.accessToken) return res.status(401).json({ error: 'unauthorized' });
    let { storeUrl, integration: integrationId, merchant: merchantId, store: storeId, solution: solutionId } = req.body;
    integrationId = parseInt(integrationId, 10);
    merchantId = parseInt(merchantId, 10);
    storeId = parseInt(storeId, 10);
    solutionId = parseInt(solutionId, 10);
    if (!integrationId || isNaN(integrationId) || ((!merchantId || isNaN(merchantId)) && ((!storeId || isNaN(storeId)) && (!solutionId || isNaN(solutionId))))) {
        return res.status(400).json({ error: 'bad request' });
    }
    if (isNaN(storeId)) storeId = 0;
    if (isNaN(solutionId)) solutionId = 0;
    const payload = {
        integrationId,
        integration: req.body.integration,
        merchantId,
        storeId,
        solutionId,
    };
    const callbackUrl = encodeURIComponent(await axios.post('https://10.0.0.4/webhook-create', payload));
    let url = mergeIntoString(req.body.installationUrl, { storeUrl, callbackUrl });
    return res.status(200).json({ url });
}

export default handler;