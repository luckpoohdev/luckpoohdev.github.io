import { Shopify as Client } from '@advisoa/crm-clients';
import md5 from 'md5';
import API from '../../../../utils/api';
import mariadb from 'mariadb';

function findPartialMatch(target, array) {
    return array.find(str => target.includes(str)) || null;
}

const translateGatewayIdToSlug = (gatewayId) => {
    const supportedGateways = ['reepay', 'quickpay', 'pensopay', 'onpay'];
    return findPartialMatch(String(gatewayId).toLowerCase(), supportedGateways);
}

const pool = mariadb.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 10000,
    connectionLimit: 2,    
});

const main = async ({ payload, data, addHistoricalImport, res }) => {
    payload.integrationLink = await API.create('integration-links', data);
    const cmsIntegrationLink = payload.integrationLink;
    const client = new Client(cmsIntegrationLink.config);

    const storeInformation = await client.getStoreInformation();
    if (storeInformation && storeInformation.address) {
        await API.update(`stores/${payload.storeId}`, {
            address: storeInformation.address,
        });
    }
    const webhookSecret = cmsIntegrationLink.secret;
    const gateways = await client.getPaymentGateways();
    console.log('gateways:', JSON.stringify(gateways, null, 4));

    for (let gateway of gateways) {
        const gatewaySlug = translateGatewayIdToSlug(gateway.name);
        if (!gatewaySlug) continue; 
        if (!finalizationScripts[gatewaySlug]) finalizationScripts[gatewaySlug] = require(`./${gatewaySlug}.ts`).default;
        if (typeof finalizationScripts[gatewaySlug] === 'function') {
            const finalizationScript = finalizationScripts[gatewaySlug];
            await finalizationScript({
                API,
                gateway,
                gatewaySlug,
                payload,
                webhookSecret,
                pool,
                addHistoricalImport,
            });
        }
    }

    // Add webhooks for Shopify store events
    await client.createWebhook({
        topic: 'orders/create',
        address: `https://api.advisoa.dk/webhooks/cmses/shopify/${webhookSecret}`,
        format: 'json'
    });
    await client.createWebhook({
        topic: 'orders/update',
        address: `https://api.advisoa.dk/webhooks/cmses/shopify/${webhookSecret}`,
        format: 'json'
    });
    await client.createWebhook({
        topic: 'orders/delete',
        address: `https://api.advisoa.dk/webhooks/cmses/shopify/${webhookSecret}`,
        format: 'json'
    });
    await client.createWebhook({
        topic: 'customers/create',
        address: `https://api.advisoa.dk/webhooks/cmses/shopify/${webhookSecret}`,
        format: 'json'
    });
    await client.createWebhook({
        topic: 'customers/update',
        address: `https://api.advisoa.dk/webhooks/cmses/shopify/${webhookSecret}`,
        format: 'json'
    });
    return res.status(200).json({});
}

module.exports = main;