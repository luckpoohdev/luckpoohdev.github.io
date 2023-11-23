import { gql } from '@apollo/client'

const TRANSACTIONS_TABLE_FRAGMENT = gql`
  fragment TransactionsTableFragment on TransactionTable {
    meta {
      pagination {
        total
        page
        pageSize
      }
    }
    data {
			id
			payment_method
			card_type
			sub_brand
			amount
			sale_id
      store_id
      solution_id
			fee_amount
      integration_name
      integration_logo_url
			type
			status
			transacted_at
			bookkeeping_status
			bookkeeping_status_message
    }
  }
`

export const GET_TRANSACTIONS = gql`
  ${TRANSACTIONS_TABLE_FRAGMENT}
  query GetTransactions($page: Int, $pageSize: Int, $merchantId: ID, $solutionId: ID, $storeId: ID, $saleId: ID, $settlementId: ID, $filters: JSON, $sort: String, $startDate: DateTime, $endDate: DateTime) {
    transactionsTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      sale_id: $saleId,
      settlement_id: $settlementId,
      period_start: $startDate,
      period_end: $endDate,
      filters: $filters,
      sort: $sort,
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...TransactionsTableFragment
    }
  }
`

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!, $solution_id: ID!) {
    getTransaction(id: $id, solution_id: $solution_id) {
			id
			solution_id
			type
      mid
      sale_id
      store_id
			integration_name
			integration_logo_url
			currency
			amount
			transacted_at
			card_type
			sub_brand
			masked_card_number
			secure
			bookkeeping_status
			bookkeping_status_message
      status
			status_code
			status_message
			recurring
			reference_id
			bank_statement_id
			settlement_id
			total_amount_fees
			fees {
        fee_type
        amount
      }
    }
  }
`

export const GET_TRANSACTION_TRACK = gql`
  query GetTransactionTrack($referenceId: String!, $solutionId: ID!) {
    getTransactionTrack(referenceId: $referenceId, solutionId: $solutionId) {
      id
      solution_id
      type
      status
      status_message
      amount
      currency
      transacted_at
      integration_logo_url
    }
  }
`

export const GET_PAID_TRANSACTIONS = gql`
  ${TRANSACTIONS_TABLE_FRAGMENT}
  query GetPaidTransactions($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    transactionsTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        type: {
          eq: 3
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...TransactionsTableFragment
    }
  }
`;

export const GET_SETTLED_TRANSACTIONS = gql`
  query GetSettledTransactions($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    transactionsTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        type: {
          eq: 2
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...TransactionsTableFragment
    }
  }
`

export const GET_AUTHORIZED_TRANSACTIONS = gql`
  query GetAuthorizedTransactions($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    transactionsTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        type: {
          eq: 1
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...TransactionsTableFragment
    }
  }
`

export const GET_REFUNDED_TRANSACTIONS = gql`
  query GetRefundedTransactions($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    transactionsTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        type: {
          eq: 4
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...TransactionsTableFragment
    }
  }
`

export const GET_FAILED_TRANSACTIONS = gql`
  query GetFailedTransactions($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID, $page: Int, $pageSize: Int) {
    transactionsTable(
      merchant_id: $merchantId,
      store_id: $storeId,
      solution_id: $solutionId,
      period_start: $startDate,
      period_end: $endDate,
      filters: {
        status: {
          eq: 2
        }
      },
      pagination: {
        page: $page,
        pageSize: $pageSize
      }
    ) {
      ...TransactionsTableFragment
    }
  }
`