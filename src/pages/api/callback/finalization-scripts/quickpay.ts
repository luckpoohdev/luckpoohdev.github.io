import md5 from 'md5';
import { Quickpay as GatewayClient } from '@advisoa/gateway-clients';

const main = async ({ gateway, gatewaySlug, API, pool, addHistoricalImport, payload }) => {
    if (!gateway?.settings?.quickpay_apikey?.value) return false;
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
            api_key: gateway.settings.quickpay_apikey.value,
        },
        secret: gatewaySecret, 
        integration: gatewayIntegration.id,
    });
    let gatewayMid;
    const gatewayClient = new GatewayClient(gateway.settings.quickpay_apikey.value);
    const gatewayAccount = await gatewayClient.getAccount();
    gatewayMid = `${gatewayAccount.id}`;
    const gatewayServiceAgreement = await API.create('gateway-service-agreements', {
        mid: gatewayMid,
        integration_link: gatewayIntegrationLink.id,
        solution: solution.id,
    });
    const newAcquiringServiceAgreementIds = [];
    const acquirerAgreementsToCreate = {};
    if (gatewayAccount?.acquirer_settings) {
        const acquirers = Object.keys(gatewayAccount?.acquirer_settings);
        for (let j = 0; j < acquirers.length; j++) {
            const acquirer = acquirers[j];
            const acquiringAgreement = gatewayAccount.acquirer_settings[acquirer];
            if (acquiringAgreement.active) {
                const acquirerSlug = acquirer;
                switch (acquirerSlug) {
                    case 'clearhaus': {
                        const mid = acquiringAgreement.mpi_merchant_id.replace(/^0+/, '');
                        acquirerAgreementsToCreate[acquirerSlug] = {
                            mid,
                            tof: mid,
                            config: {
                                api_key: acquiringAgreement.api_key,
                            },
                        }
                        break;
                    }
                }
            }
        }
    }

    const slugsOfAcquiringAgreementsToCreate = Object.keys(acquirerAgreementsToCreate);
    if (slugsOfAcquiringAgreementsToCreate.length) {
        const connection = await pool.getConnection();                     
        const acquirerIntegrationRows = (await connection.query(`SELECT id, slug FROM integrations WHERE slug IN (${slugsOfAcquiringAgreementsToCreate.map((slug) => `'${slug}'`).join(',')})`));
        connection.release();
        for (let j = 0; j < acquirerIntegrationRows?.length; j++) {
            const acquirerIntegration = acquirerIntegrationRows[j];
            const newAcquiringserviceAgreement = await API.create('acquiring-service-agreements', {
                mid: acquirerAgreementsToCreate[acquirerIntegration.slug].mid,
                tof: acquirerAgreementsToCreate[acquirerIntegration.slug].tof,
                solution: solution.id,
            });
            newAcquiringServiceAgreementIds.push(newAcquiringserviceAgreement.id);
            acquirerSettlementScanner.add(acquirerIntegration.slug, { mid: newAcquiringserviceAgreement.mid })
            const res = await API.create('integration-links', {
                acquiring_service_agreement: newAcquiringserviceAgreement.id,
                integration: acquirerIntegration.id,
                config: acquirerAgreementsToCreate[acquirerIntegration.slug].config,
                healthy: true,
                active: true,
                secret: md5(acquirerAgreementsToCreate[acquirerIntegration.slug].mid+Date.now()),
            });
        }                  
    }
}

export default main;