import md5 from 'md5';

const main = async ({ gateway, API, gatewaySlug, addHistoricalImport, payload }) => {

    if (!gateway?.settings?.access_token?.value) return false;
    const gatewayIntegration = (await API.findMany('integrations', {
        filters: {
            slug: gatewaySlug,
            type: 'gateway',
        },
    }))?.[0];
    if (!gatewayIntegration) throw new Error(`Failed to find gateway integration with slug ${gatewaySlug}`);
    const solution = await API.create('solutions', {
        type: 'ECOM',
        name: gateway.title,
        store: payload.storeId,
    });
    addHistoricalImport('woocommerce', {
        integrationLink: payload.integrationLink,
        solutionId: solution.id,
        storeUrl: payload.storeUrl,
        type: 'cms',
    });
    const gatewaySecret = md5(`${gatewaySlug}${solution.id}`);
    const gatewayIntegrationLink = await API.create('integration-links', {
        config: {
            access_token: gateway.settings.access_token.value,
            refresh_token: gateway.settings.refresh_token.value,
        },
        secret: gatewaySecret, 
        integration: gatewayIntegration.id,
    });
    let gatewayMid;

    const GatewayClient = require('@advisoa/gateway-clients').OnPay;
    const gatewayClient = new GatewayClient(gateway.settings.access_token.value);
    gatewayMid = 'temp-under-development'

    const gatewayServiceAgreement = await API.create('gateway-service-agreements', {
        mid: gatewayMid,
        integration_link: gatewayIntegrationLink.id,
        solution: solution.id,
    });

}

export default main;