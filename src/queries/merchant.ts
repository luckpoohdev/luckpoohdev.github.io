import { gql } from '@apollo/client'

export const GET_MERCHANT_PROFILE = gql`   
  query GetMerchantProfile($id: ID!) {
    merchant(id: $id) {
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
          cover {
            data {
              attributes {
                url
              }
            }
          }
          vat_number
          address {
            line_1
            line_2
            zip
            city
            country
          }
          phone
          email
          contact {
            firstname
            surname
            phone
            email
          }
          industry {
            data {
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`