import qs from 'qs';
import getConfig  from 'next/config';

import sanitizeStrapiData from './sanitizeStrapiData';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

class API {
    static async findMany(endpoint, options) {
        const params = options?.filters || options?.populate || options?.fields ? qs.stringify({
            ...(options?.filters ? { filters: options.filters } : {}),
            ...(options?.populate ? { populate: options.populate } : {}),
            ...(options?.fields ? { fields: options.fields } : {}),
        }, {
            encodeValuesOnly: true, // prettify URL
        }) : null
        const res = await fetch(`${publicRuntimeConfig.API_URL}/${endpoint}${params ? `?${params}` : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serverRuntimeConfig.API_TOKEN}`,
            }
        })
        return sanitizeStrapiData(await res.json()).data
    }
    static async create(endpoint, data) {
        const res = await fetch(`${publicRuntimeConfig.API_URL}/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify({ data }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serverRuntimeConfig.API_TOKEN}`,
            }
        })
        return sanitizeStrapiData(await res.json()).data
    }
    static async update(endpoint, data) {
        const res = await fetch(`${publicRuntimeConfig.API_URL}/${endpoint}`, {
            method: 'PUT',
            body: JSON.stringify({ data }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serverRuntimeConfig.API_TOKEN}`,
            }
        })
        return sanitizeStrapiData(await res.json()).data
    }
}

export default API;