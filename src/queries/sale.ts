import { gql } from '@apollo/client'

const SALES_TABLE_FRAGMENT = gql`
  fragment SalesTableFragment on SaleTable {
    meta {
      pagination {
        total
        page
        pageSize
      }
    }
    data {
      id
      store_id
      latest_settlement_payment_method
      latest_settlement_card_type
      latest_settlement_sub_brand
      solution_name
      sum_total_amount
      region
      status
      placed_at
      latest_payment_status
      bookkeeping_status
      bookkeeping_status_message
    }
  }
`

export const GET_SALE = gql`
  query GetSale($id: ID!, $store_id: ID!) {
    getSale(id: $id, store_id: $store_id) {
      data {
        id
        merchant_id
        store_id
        placed_at
        payment_method
        status
        payment_status
        transaction_status
        payment_card_type
        payment_card_sub_brand
        currency
        sum_total_amount
        sum_total_amount_vat
        sum_total_amount_no_vat
        shipping_amount
        shipping_amount_no_vat
        lines {
          title
          description
          quantity
          total
          total_vat
        }
      }
    }
  }
`

export const GET_SOURCE_ID_BY_ID = gql`
  query GetSourceIdById($id: ID!) {
    sale(id: $id) {
      data {
        attributes {
          source_id
        }
      }
    }
  }
`

export const GET_COMPLETED_SALES = gql`
  ${SALES_TABLE_FRAGMENT}
  query GetCompletedSales($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    salesTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        status: {
          eq: 5
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...SalesTableFragment
    }
  }
`

export const GET_FAILED_SALES = gql`
  ${SALES_TABLE_FRAGMENT}
  query GetFailedSales($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    salesTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        status: {
          eq: 8
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...SalesTableFragment
    }
  }
`

export const GET_RETURNED_SALES = gql`
  ${SALES_TABLE_FRAGMENT}
  query GetReturnedSales($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    salesTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        status: {
          eq: 7
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...SalesTableFragment
    }
  }
`

export const GET_SALES = gql`
  ${SALES_TABLE_FRAGMENT}
  query GetSales($page: Int, $pageSize: Int, $merchantId: ID, $solutionId: ID, $storeId: ID, $filters: JSON, $startDate: DateTime, $endDate: DateTime) {
    salesTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: $filters,
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...SalesTableFragment
    }
  }
`

export const SALE = gql`
  query GetSale($id: ID!) {
    sale(id: $id) {
      data {
        attributes {
          placed_at
          due_at
          source_id
          status_text
          latest_payment_status_text
          latest_payment_status_code
          lines {
            title
            description
            quantity
            unit_price_amount
            total_price_amount
            unit_price_amount_vat
            total_price_amount_vat
          }
          currency
          sum_total_amount_vat
          sum_total_amount
          shipping_amount
          solution {
            data {
              attributes {
                acquiring_service_agreements {
                  data {
                    attributes {
                      mid
                      acquiring_service {
                        data {
                          attributes {
                            provider {
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
                  }
                }
                gateway_service_agreements {
                  data {
                    attributes {
                      mid
                      gateway_service {
                        data {
                          attributes {
                            provider {
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
                  }
                }
                terminal_service_agreements {
                  data {
                    attributes {
                      mid
                      terminal_service {
                        data {
                          attributes {
                            provider {
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
                  }
                }
                third_party_agreements {
                  data {
                    attributes {
                      mid
                      third_party_provider_service {
                        data {
                          attributes {
                            third_party_provider {
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

export const CAPTURE_PAYMENT = gql`
  mutation CapturePayment($saleId: ID!) {
    capturePayment(sale: $saleId) {
      status
      error
    }
  }
`;

export const CANCEL_PAYMENT = gql`
  mutation CancelPayment($saleId: ID!) {
    cancelPayment(sale: $saleId) {
      status
      error
    }
  }
`;

export const REFUND_PAYMENT = gql`
  mutation RefundPayment($saleId: ID!) {
    refundPayment(sale: $saleId) {
      status
      error
    }
  }
`;