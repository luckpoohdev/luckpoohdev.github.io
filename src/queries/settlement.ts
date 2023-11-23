import { gql } from '@apollo/client'

export const GET_SETTLEMENTS = gql`
  query GetSetttlements($merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int, $filters: JSON) {
    settlementsTable(
      merchant_id: $merchantId
      store_id: $storeId
      solution_id: $solutionId
      filters: $filters
      pagination: {
        page: $page
        pageSize: $pageSize
      }
    ) {
      meta {
        pagination {
          total
          page
          pageSize
        }
      }
      data {
        id
        solution_id
        period_start
        period_end
        sales_amount_sum
        refund_amount_sum
        dispute_amount_sum
        fee_amount_sum
        payout_amount
        payout_currency
        balanced_status
        balanced_at
      }
    }
  }
`

export const GET_SETTLEMENT_TRANSACTIONS = gql`
  query GetSettlementTransactions($settlementId: ID!, $type: String, $page: Int, $pageSize: Int) {
    transactions(
      filters: {
        settlement: {
          id: { eq: $settlementId }
        }
        type: { eq: $type }
      }
      pagination: {
        page: $page
        pageSize: $pageSize
      }
      sort: "transacted_at:desc"
    ) {
      meta {
        pagination {
          total
        }
      }
      data {
        id
        attributes {
          transacted_at
          reference_id
          source_id
          card_type
          sub_brand
          type
          status_text
          amount
          fee_amount
          currency
          sale {
            data {
              id
            }
          }
        }
      }
    }
  }
`

export const GET_SETTLEMENT = gql`
  query GetSettlement($id: ID!, $solution_id: ID!) {
    getSettlement(id: $id, solution_id: $solution_id) {
			id
			merchant_id
			store_id
      acquirer_icon_url
			mid
			payout_amount
			currency
			period_start
			period_end
			payout_date
			balanced
			settlement_type
			bank_statement_id
			total_amount_sales
			total_amount_refunds
			total_amount_disputes
			total_quantity_transactions
			total_amount_fees
			total_quantity_sales_transactions
			total_quantity_refund_transactions
			total_quantity_dispute_transactions
			fees {
        fee_type
        amount
      }
    }
  }
`