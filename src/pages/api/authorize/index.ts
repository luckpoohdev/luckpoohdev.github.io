import { getSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import crypto from 'crypto';

// Initialize Redis client
const redis = new Redis({
    host: process.env.JOB_QUEUE_REDIS_HOST,
    port: process.env.JOB_QUEUE_REDIS_PORT,
    password: process.env.JOB_QUEUE_REDIS_PASSWORD,
});

const integrationAuthorizationScraper = new Queue(process.env.AUTHORIZE_INTEGRATION_JOB_QUEUE_NAME, {
    connection: redis,
});

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

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (req.method === 'POST') {
        if (!session) return res.status(401).json({ error: 'unauthorized' });
        if (req.body.integration) {
            const guid = uuidv4();
            const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(Buffer.from(JSON.stringify({ login: req.body.login, password: req.body.password })).toString('base64'))).toString('base64');
            integrationAuthorizationScraper.add(guid, { integration: req.body.integration, authUrl: req.body.authUrl, integrationId: req.body.integrationId, integrationLinkId: req.body.integrationLinkId, data: encryptedData, merchantId: req.body.merchantId });
            return res.status(200).json({ guid });
        } else {
            return res.status(400).json({ error: 'bad request' });
        }
    } else {
        return res.status(405).json({ error: 'method not allowed' });
    }
};