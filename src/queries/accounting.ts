import { gql } from '@apollo/client'

export const GET_MERCHANT_ACCOUNTING_ACCOUNTS = gql`
  query getMerchantAccountingAccounts($merchantId: ID, $storeId: ID, $solutionId: ID) {
    merchantAccountingAccounts(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId) {
      data {
        number
        name
        heading
        parent {
          number
          name
          heading
        }
      }
    }
  }
`

export const GET_MERCHANT_ACCOUNTING_VAT_ACCOUNTS = gql`
  query getMerchantAccountingVatAccounts($merchantId: ID, $storeId: ID, $solutionId: ID) {
    merchantAccountingVatAccounts(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId) {
      data {
        number
        name
        ratePercentage
        vatCode
      }
    }
  }
`

export const GET_MERCHANT_ACCOUNTING_JOURNALS = gql`
  query getMerchantAccountingJournals($merchantId: ID, $storeId: ID, $solutionId: ID) {
    merchantAccountingJournals(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId) {
      data {
        id
        name
      }
    }
  }
`

export const GET_MERCHANT_ACCOUNTING_DEPARTMENTS = gql`
  query getMerchantAccountingDepartments($merchantId: ID, $storeId: ID, $solutionId: ID) {
    merchantAccountingDepartments(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId) {
      data {
        id
        name
      }
    }
  }
`

export const SAVE_MERCHANT_ACCOUNTING_SETUP = gql`
  mutation saveMerchantAccountingSetup($merchantId: ID, $storeId: ID, $solutionId: ID, $setup: JSON!) {
    saveMerchantAccountingSetup(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId, setup: $setup) {
      status
    }
  }
`

export const TOGGLE_MERCHANT_AUTOMATIC_BOOKKEEPING = gql`
  mutation toggleMerchantAutomaticBookkeeping($merchantId: ID, $storeId: ID, $solutionId: ID, $active: Boolean!) {
    toggleMerchantAutomaticBookkeeping(merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId, active: $active) {
      status
    }
  }
`

export const TOGGLE_STORE_SPECIFIC_BOOKKEEPING = gql`
  mutation toggleStoreSpecificBookkeeping($storeId: ID, $merchantId: ID, $enabled: Boolean!) {
    toggleStoreSpecificBookkeeping(storeId: $storeId, merchantId: $merchantId, enabled: $enabled) {
      status
    }
  }
`

export const TOGGLE_SOLUTION_SPECIFIC_BOOKKEEPING = gql`
  mutation toggleSolutionSpecificBookkeeping($solutionId: ID, $merchantId: ID, $enabled: Boolean!) {
    toggleSolutionSpecificBookkeeping(solutionId: $solutionId, merchantId: $merchantId, enabled: $enabled) {
      status
    }
  }
`

export const GET_INTEGRATION_LINK = gql`
  query getIntegrationLink($type: String!, $merchantId: ID, $storeId: ID, $solutionId: ID, $getClosest: Boolean) {
    getIntegrationLink(type: $type, merchantId: $merchantId, storeId: $storeId, solutionId: $solutionId, getClosest: $getClosest) {
      id
      secret
      active
      healthy
      config
      merchantId
      storeId
      solutionId
      disabledByStore
      disabledByMerchant
    }
  }
`