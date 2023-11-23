import { gql } from '@apollo/client';

export const GET_ACQUIRING_PROVIDERS = gql`
    query getAcquiringProviders($merchantId: ID, $storeId: ID, $solutionId: ID) {
        getAcquiringProviders(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId) {
            data {
                name
                slug
                logo_url
            }
        }
    }    
`;