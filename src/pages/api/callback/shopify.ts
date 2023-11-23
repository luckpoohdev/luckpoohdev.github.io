import axios from 'axios';

const SHOPIFY_API_KEY = '984e4e36c99245f47d55b3ff6ff447bb';
const SHOPIFY_API_SECRET = 'aa6d0c99773893bce86f9387bbbb6f4d';

const handler = async (req, res) => {
    const { shop, code, state } = req.query;
    const { returnUrl, callbackToken } = JSON.parse(decodeURIComponent(state));
    const callbackUrl = `https://paypilot.advisoa.dk/api/callback/${callbackToken}`;

    // 1. Obtain the access token from Shopify using the code
    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
    
    const accessTokenPayload = {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
    };

    try {
        const accessTokenResponse = await axios.post(accessTokenRequestUrl, accessTokenPayload);
        const accessToken = accessTokenResponse.data.access_token;

        // 2. Forward the request (with access token and other necessary data) to the generic callback using the callbackUrl
        const forwardData = {
            shopName: shop,
            accessToken,
        };

        await axios.post(callbackUrl, forwardData);

        // 3. Retrieve the redirectUrl (assuming it's a parameter in the callbackUrl, but adjust as needed)

        // 4. Redirect the user to the redirectUrl
        res.redirect(302, returnUrl);

    } catch (error) {
        console.error('Error processing Shopify callback:', error);
        res.status(500).json({ error });
    }
};

export default handler;