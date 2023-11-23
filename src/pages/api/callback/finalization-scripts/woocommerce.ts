import { WooCommerce as Client } from '@advisoa/crm-clients';
//import Redis from 'ioredis';
//import { Queue } from 'bullmq';
import mariadb from 'mariadb';

// Initialize Redis client
/*const redis = new Redis({
    host: process.env.JOB_QUEUE_REDIS_HOST,
    port: process.env.JOB_QUEUE_REDIS_PORT,
    password: process.env.JOB_QUEUE_REDIS_PASSWORD,
});

const acquirerSettlementScanner = new Queue(process.env.ACQUIRER_SETTLEMENT_SCANNER, {
    connection: redis,
});*/

const pool = mariadb.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 10000,
    connectionLimit: 2,    
});

function findPartialMatch(target, array) {
    return array.find(str => target.includes(str)) || null;
}

const translateGatewayIdToSlug = (gatewayId) => {
    const supportedGateways = ['reepay', 'quickpay', 'pensopay', 'onpay'];
    return findPartialMatch(String(gatewayId).toLowerCase(), supportedGateways);
}



const main = async ({ payload, data, addHistoricalImport, res, API }) => { 

    payload.integrationLink = await API.create('integration-links', data);  
    const cmsIntegrationLink = payload.integrationLink;
    const client = new Client(`https://${payload.storeUrl}`, cmsIntegrationLink.config.consumer_key, cmsIntegrationLink.config.consumer_secret);
    const storeInformation = await client.getStoreInformation();
    if (storeInformation) {
        await API.update(`stores/${payload.storeId}`, {
            address: storeInformation.address,
        });
    }
    const webhookSecret = cmsIntegrationLink.secret;
    const gateways = (await client.get('payment_gateways'))?.filter((gateway) => gateway.enabled);
    const finalizationScripts = {};
    for (let i = 0; i < gateways?.length; i++) {
        const gateway = gateways[i];
        const gatewaySlug = translateGatewayIdToSlug(gateway.id);
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
    const delivery_url = Client.generateSignedWebhookUrl({
        merchantId: payload.merchantId, storeId: payload.storeId,
    });
    await client.updateWebhooks({
        create: [{
            name: 'paypilot.order.created',
            topic: 'order.created',
            delivery_url,
        }, {
            name: 'paypilot.order.updated',
            topic: 'order.updated',
            delivery_url,
        }, {
            name: 'paypilot.order.deleted',
            topic: 'order.deleted',
            delivery_url,
        }, {
            name: 'paypilot.order.restored',
            topic: 'order.restored',
            delivery_url,
        }, {
            name: 'paypilot.customer.created',
            topic: 'customer.created',
            delivery_url,
        }, {
            name: 'paypilot.customer.updated',
            topic: 'customer.updated',
            delivery_url,
        }],
    });
    return res.status(200).json({});
}

module.exports = main;