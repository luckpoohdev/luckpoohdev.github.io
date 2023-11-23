import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import md5 from 'md5';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import getConfig from 'next/config';

import API from '../../../utils/api';

const { publicRuntimeConfig } = getConfig();

// Initialize Redis client
const redis = new Redis({
    host: process.env.JOB_QUEUE_REDIS_HOST,
    port: process.env.JOB_QUEUE_REDIS_PORT,
    password: process.env.JOB_QUEUE_REDIS_PASSWORD,
});

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../../../../key.pem'), 'utf8');

const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAomZHvZE/l8Rfoog7JQaV
NgL3UkaD9v/gnrSkrgKJQPQ+4aK5fEVZ6LQqeHrmRt/BDqjQMq8hpYulUfOq7zMd
sK+KTb6Bfd67moxg7AbpsO6AVklVIT+y8CwGouSAW28ydIrhVtD0MUgxTe0oFzzC
TLQFr7L8w9SPe9Q/SMldwAcFyCWMR/TW+eENpuXBSrtYtDwjeGVzCZMeq0cai2Nh
Rxx5sBUstP1Ruwwl7C4sofFtOB12jj4n4ha+GYEKHG30v/S1OT0JHMhyevOLRGQZ
NbpKu//uNV7WUz93qqYRDuqrpwL5nGxif0ddcULXepJsTz4/OW2/ina8J5Ui0JuC
UR3dRJe4hJ+HqHrrRsMCv234qRDR7sW+7z38I7p/0eZAnjlpSmcxpeTRFM9BPn5C
Fun237U9dzjtYZ2ec7edvsc3p23Vv2r+BbgqpxcAr0wO1yhJehKlEg5ispDOcsfs
C8gNenNadac4VRy1qRhFwTf6dRXyVd25cw1jpji2C5Wufgvn1YMOcimB3xexHe+C
G4wilPv83dHT7Q9Xyn3+sumxbN2727Jq85JVx2wP/IzBnbKHCk4GVYPsjLN37e3Q
DZnqlLKdXUXLByPJgfO7BxHEAiGIq2beC1pl+FHChF/clzh0EYpsaGWBFL4t/AMO
JH6cxgnXefnXDor7Jc/wpK0CAwEAAQ==
-----END PUBLIC KEY-----`;

const historicalimporter = new Queue(process.env.HISTORICAL_IMPORTER_JOB_QUEUE_NAME, {
    connection: redis,
});

const addHistoricalImport = (jobName, jobData) => {
    jobData.integrationLink = crypto.publicEncrypt(publicKey, Buffer.from(JSON.stringify(jobData.integrationLink))).toString('base64');
    historicalimporter.add(jobName, jobData);
}

const finalizationScripts = {};
const handler = async (req, res) => {
    try {
        const payload = JSON.parse(JSON.stringify(Object.fromEntries(new URLSearchParams(crypto.privateDecrypt({
            key: privateKey,
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '52db951d-6c05-4385-9321-adfde13e6bcf',
        }, Buffer.from(req.query.payload, 'base64url')).toString('ascii')))));
        try {
            delete req.query.payload;
            const data = {
                healthy: true,
                active: true,
                secret: md5(`${req.query.token}${Date.now()}`),
                integration: payload.integrationId,
                merchant: payload.merchantId,
                config: Object.keys(req.body).length ? req.body : req.query,
            };
            if (payload.storeId) data.store = payload.storeId;
            if (payload.solutionId) data.solution = payload.solutionId;
            if (payload.integrationType === 'bookkeeping' && payload.integrationSlug === 'economic') {
                data.config.setup = {
                    accounting_year_follows_calendar_year: true,
                    base_country_code: 'DK',
                    default_country_code: 'DK',
                    journal: 1,
                    sales_department: null,
                    general_balancing_account: 5650,
                    general_round_off_account: 1090,
                    general_currency_exchange_loss_account: 4481,
                    general_currency_exchange_win_account: 4381,
                    b2c: {
                        vat_code_sales: 'U25',
                        no_vat_code_sales: 'U25',
                        vat_product_sale_account: 1010,
                        vat_product_refund_account: 1010,
                        no_vat_product_sale_account: 1030,
                        no_vat_product_sale_refund: 1030,
                        vat_service_sale_account: 1010,
                        vat_service_refund_account: 1010,
                        no_vat_service_sale_account: 1030,
                        no_vat_service_refund_account: 1030,
                        vat_shipping_sale_account: 2811,
                        vat_shipping_refund_account: 2811,
                        no_vat_shipping_sale_account: 2811,
                        no_vat_shipping_refund_account: 2811
                    },
                    b2b: {
                        vat_code_sales: 'UEUV',
                        no_vat_code_sales: 'UEUV',
                        vat_product_sale_account: 1010,
                        vat_product_refund_account: 1010,
                        no_vat_product_sale_account: 1030,
                        no_vat_product_sale_refund: 1030,
                        vat_service_sale_account: 1010,
                        vat_service_refund_account: 1010,
                        no_vat_service_sale_account: 1030,
                        no_vat_service_refund_account: 1030,
                        vat_shipping_sale_account: 2811,
                        vat_shipping_refund_account: 2811,
                        no_vat_shipping_sale_account: 2811,
                        no_vat_shipping_refund_account: 2811
                    },
                    non_eu: {
                        vat_code_sales: 'U25',
                        no_vat_code_sales: 'U25',
                        vat_product_sale_account: 1010,
                        vat_product_refund_account: 1010,
                        no_vat_product_sale_account: 1030,
                        no_vat_product_sale_refund: 1030,
                        vat_service_sale_account: 1010,
                        vat_service_refund_account: 1010,
                        no_vat_service_sale_account: 1030,
                        no_vat_service_refund_account: 1030,
                        vat_shipping_sale_account: 2811,
                        vat_shipping_refund_account: 2811,
                        no_vat_shipping_sale_account: 2811,
                        no_vat_shipping_refund_account: 2811
                    },
                    selected_oss_tax_countries: null,
                    payout_type: 'bundle',
                    payout_account: {
                        elavon: 5820
                    },
                    card_fee_account: {
                        elavon: 3628
                    },
                    receivables_account: {
                        elavon: 5650
                    },
                    economic_card_fee_journal: {
                        elavon: 1
                    }
                }
            }
            if (payload.integrationType === 'cms') {
                if (!finalizationScripts[payload.integrationSlug]) finalizationScripts[payload.integrationSlug] = require(`./finalization-scripts/${payload.integrationSlug}.ts`);
                return await finalizationScripts[payload.integrationSlug]({ payload, data, addHistoricalImport, res, API });
            } else if (payload.integrationType === 'bookkeeping') {
                return res.status(307).redirect(`${publicRuntimeConfig.BASE_URL}/bookkeping/#merchant=${payload.merchantId}`);
            } else {
                return res.status(200).json({});
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'internal server error' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'bad request' });
    }
}

export default handler;