import axios from 'axios';
const getIntegrationConnectionUrl = async (data) => {
    const res = await axios.post('/api/integration-connection-url', data);
    return res.data.url;
}
export default getIntegrationConnectionUrl;