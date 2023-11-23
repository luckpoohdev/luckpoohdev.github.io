import axios from 'axios';

const handler = async (req, res) => {
    const connectionInitiationRes = await axios.post('https://api.paypilot.dk/connection/initiate', req.body);
    return res.status(200).json(connectionInitiationRes?.data ?? {});
}

export default handler;