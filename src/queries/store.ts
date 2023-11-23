import { gql } from '@apollo/client'

export const GET_STORE_GENERAL_DATA = gql`
    query Store($storeId: ID!) {
        store(id: $storeId) {
            data {
                id
                attributes {
                name
                type
                address {
                    line_1
                    line_2
                    zip
                    city
                    country
                }
                phone
                email
                notes
                }
            }
        }
    }
`

export const GET_STORE_INTEGRATIONS = gql`
    query IntegrationLinks($storeId: ID!) {
        integrationLinks(filters: { store: { id: { eq: $storeId } } }) {
        data {
            id
            attributes {
            integration {
                data {
                attributes {
                    name
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

export const GET_AVAILABLE_INTEGRATIONS = gql`
    query AvailableIntegrations($storeId: ID!) {
        integrations(
            filters: {
                integration_links: { or: [ { id: null }, { store: { id: { ne: $storeId }  } } ] }
                type: { eq: "cms" }
            },
            sort: "name:asc"
        ) {
            data {
                attributes {
                    name
                    color
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
`

export const CREATE_STORE = gql`
  fragment StoreEntityResponseFragment on StoreEntityResponse {
    data {
      id
      attributes {
        name
        type
        notes
        phone
        email
      }
    }
  }
  
  mutation CreateStore($data: StoreInput!) {
    createStore(data: $data) {
      ...StoreEntityResponseFragment
    }
  }
`;