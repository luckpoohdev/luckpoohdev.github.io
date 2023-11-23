import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GetTransactions($startDate: DateTime!, $endDate: DateTime!, $storeId: ID, $merchantId: ID) {
    transactions(
      filters: {
        and: [
          { or: [
            { solution: { store: { id: { eq: $storeId } } } }
            { solution: { store: { merchant: { id: { eq: $merchantId } } } } }
          ] }
          {
            status_text: {
              in: ["paid", "authorized", "refunded", "returned"]
            }
          }
          { transacted_at: { gte: $startDate } }
          { transacted_at: { lt: $endDate } }
        ]
      }
      pagination: { limit: 9999999 }
      sort: "transacted_at:asc"
    ) {
      data {
        attributes {
          transacted_at
          fee_amount
          amount
          status_text
          currency
          region
          payment_method
        }
      }
    }
  }
`;

export const GET_SALES = gql`
  query GetSales($startDate: DateTime!, $endDate: DateTime!, $storeId: ID, $merchantId: ID) {
    sales(
      filters: {
        and: [
          {
            or: [
              { solution: { store: { id: { eq: $storeId } } } }
              { solution: { store: { merchant: { id: { eq: $merchantId } } } } }
            ]
          }
          { placed_at: { gte: $startDate } }
          { placed_at: { lt: $endDate } }
        ]
      }
      pagination: { limit: 9999999 }
      sort: "placed_at:asc"
    ) {
      data {
        attributes {
          placed_at
          sum_total_amount
          currency
          status_text
          latest_payment_status_text
          region
        }
      }
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers($startDate: DateTime!, $endDate: DateTime!, $storeId: ID, $merchantId: ID) {
    customers(
      filters: {
        and: [
          {
            or: [
                { purchases: { solution: { store: { id: { eq: $storeId } } } } }
                {
                  purchases: {
                    solution: { store: { merchant: { id: { eq: $merchantId } } } }
                  }
                }
            ]
          }
          { purchases: { placed_at: { gte: $startDate } } }
          { purchases: { placed_at: { lt: $endDate } } }
          {
            purchases: { latest_payment_status_text: { in: ["settled", "paid"] } }
          }
        ]
      }
      pagination: { limit: 9999999 }
    ) {
      data {
        attributes {
          firstname
          surname
          purchases(pagination: {
            limit: 2
          }) {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_INTEGRATIONS = gql`
  query GetIntegrations($storeId: ID, $merchantId: ID) {
    integrations(
      filters: {
        and: [
          {
            or: [
              { integration_links: { solution: { store: { id: { eq: $storeId } } } } }
              { integration_links: { solution: { store: { merchant: { id: { eq: $merchantId } } } } } }
              { integration_links: { store: { id: { eq: $storeId } } } }
              { integration_links: { store: { merchant: { id: { eq: $merchantId } } } } }
              { integration_links: { merchant: { id: { eq: $merchantId } } } }
              { integration_links: { merchant: { stores: { id: { eq: $storeId } } } } }
            ]
          }
        ]
      }
      pagination: { limit: 9999999 }
    ) {
      data {
        attributes {
          integration_links(
            filters: {
              or: [
                { solution: { store: { id: { eq: $storeId } } } }
                { solution: { store: { merchant: { id: { eq: $merchantId } } } } }
                { store: { id: { eq: $storeId } } }
                { store: { merchant: { id: { eq: $merchantId } } } }
                { merchant: { id: { eq: $merchantId } } }
                { merchant: { stores: { id: { eq: $storeId } } } }
              ]
            }
          ) {
            data {
              id
              attributes {
                active
                healthy
                solution {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                store {
                  data {
                    attributes {
                      name
                    }
                  }
                }
                merchant {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
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
`;