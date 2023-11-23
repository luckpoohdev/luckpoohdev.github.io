import getConfig from 'next/config';

import mergeIntoString from './mergeIntoString';

const createInstallationUrlFromTemplate = (templateUrl: string, mergeCodesObj: any): string => {
    const { publicRuntimeConfig } = getConfig();
    console.log('publicRuntimeConfig.TUNNEL_URL:', publicRuntimeConfig.TUNNEL_URL);
    mergeCodesObj.BASE_URL = publicRuntimeConfig.BASE_URL;
    let [ url, query ] = mergeIntoString(templateUrl, mergeCodesObj).split('?');
    if (query) {
        const params = query.split('&');
        for (let i = 0; i < params?.length; i++) {
            let [ paramName, paramValue ] = params[i].split('=');
            if (publicRuntimeConfig.TUNNEL_URL && paramName.indexOf('callback') !== -1) paramValue = paramValue.replace(mergeCodesObj.BASE_URL, publicRuntimeConfig.TUNNEL_URL).trim();
            params[i] = `${paramName}=${encodeURIComponent(paramValue)}`;
        }
        query = `?${params.join('&')}`;
    }
    return `${url}${query}`;
}

export default createInstallationUrlFromTemplate;