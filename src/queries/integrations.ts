import { gql } from '@apollo/client'

export const GET_INTEGRATIONS = gql`
    query IntegrationLinks($solutionId: ID, $merchantId: ID) {
        integrationLinks(filters: { or: [ { solution: { id: { eq: $solutionId } } }, { merchant: { id: { eq: $merchantId } } } ] }) {
        data {
            id
            attributes {
            active
            healthy
            integration {
                data {
                attributes {
                    name
                    type
                    logo {
                    data {
                        attributes {
                        url
                        }
                    }
                    }
                }
                }
            }
            }
        }
        }
    }
`

/*export const GET_AVAILABLE_INTEGRATIONS = gql`
    query AvailableIntegrations($merchantId: ID!, $types: [String]!) {
        integrations(
            filters: {
                integration_links: { or: [ { id: null }, { merchant: { id: { ne: $merchantId }  } } ] }
                type: { in: $types }
            },
            sort: "name:asc"
        ) {
            data {
                id
                attributes {
                    name
                    type
                    color
                    slug
                    scraper_auth
                    scraper_auth_config
                    installation_url
                    logo {
                        data {
                            attributes {
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;*/

export const GET_AVAILABLE_INTEGRATIONS = gql`
    query AvailableIntegrations($types: [String]!) {
        integrations(
            filters: {
                type: { in: $types }
            },
            sort: "name:asc"
        ) {
            data {
                id
                attributes {
                    name
                    type
                    color
                    slug
                    scraper_auth
                    scraper_auth_config
                    installation_url
                    logo {
                        data {
                            attributes {
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const DELETE_INTEGRATION_LINK = gql`
    mutation DeleteIntegrationLink($id: ID!) {
        deleteIntegrationLink(id: $id) {
            __typename
        }
    }
`;

export const UPDATE_INTEGRATION_LINK = gql`
    fragment IntegrationLinkEntityResponseFragment on IntegrationLinkEntityResponse {
        data {
            id
            attributes {
                __typename
                updatedAt
                createdAt
                active
                secret
                healthy
            }
        }
    }
  
    mutation UpdateIntegrationLink($id: ID!, $data: IntegrationLinkInput!) {
        updateIntegrationLink(id: $id, data: $data) {
            ... IntegrationLinkEntityResponseFragment
        }
    }
`;