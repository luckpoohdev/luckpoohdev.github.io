import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import md5 from 'md5';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import API from '../../../utils/api';
import { WooCommerce as Client } from '@advisoa/crm-clients';

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
        try {
            const client = new Client(`https://bambuni.dk`, 'ck_22944eec7e997b384036d386542d16716bfe53c0', 'cs_dd85079d90f345b96dc3e69b76bd413497e05b55');
            return res.status(200).json({orders});
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
}

export default handler;