import { gql } from '@apollo/client';

export const BANK_EXPENSES_TABLE = gql`
    query GetBankExpensesTable($page: Int, $pageSize: Int, $merchantId: ID, $solutionId: ID, $storeId: ID, $filters: JSON) {
        bankExpensesTable(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            filters: $filters,
            pagination: {
                page: $page,
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
                recipient
                amount
                account_number
                description
                transacted_at
            }
        }
    }
`;

export const BANK_DEPOSITS_TABLE = gql`
    query GetBankDepositsTable($page: Int, $pageSize: Int, $merchantId: ID, $solutionId: ID, $storeId: ID, $filters: JSON) {
        bankDepositsTable(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            periodStart: $startDate,
            periodEnd: $endDate,
            pagination: {
                page: $page,
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
                sender
                amount
                account_number
                description
                transacted_at
                balanced
            }
        }
    }
`;

export const UNBALANCED_SETTLEMENTS_TABLE = gql`
    query GetUnbalancedSettlementsTable($page: Int, $pageSize: Int, $merchantId: ID, $solutionId: ID, $storeId: ID, $filters: JSON) {
        unbalancedSettlementsTable(
            merchantid: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            filters: $filters,
            pagination: {
              page: $page,
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
                period_start
                period_end
                payout_amount
                provider
                balanced
            }
        }
    }
`;

export const BANK_ACCOUNTS = gql`
    query GetBankAccounts($merchantId: ID, $storeId: ID, $solutionId: ID) {
        bankAccounts(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId
        ) {
            balance
            account_number
            account_name
            acount_currency
            bank_logo_src
        }
    }
`;

export const BANK_DEPOSITS_WIDGET_DATA = gql`
    query GetBankDepositsWidgetData(merchantId: ID, storeId: ID, startPeriod: DateTime!, endPeriod: DateTime!, selectedPeriod: String!) {
        bankDepositsWidgetData(
            merchantId: $merchantId,
            storeId: $storeId,
            startPeriod: $startPeriod,
            endPeriod: $endPeriod,
            selectedPeriod: $selectedPeriod
        ) {
            sum_amount
            delta_percentage
            chart
        }
    }
`;

export const BANK_EXPENSES_WIDGET_DATA = gql`
    query GetBankExpensesWidgetData($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID) {
        bankExpensesWidgetData(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            periodStart: $startDate,
            periodEnd: $endDate
        ) {
            sum_amount
            delta_percentage
            chart
        }
    }
`;

export const BANK_BALANCE_OVERVIEW_WIDGET_DATA = gql`
    query GetBankBalanceOverviewWidgetData($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID) {
        bankBalanceOverviewWidgetData(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            periodStart: $startDate,
            periodEnd: $endDate
        ) {
            sum_income
            delta_percentage_income
            sum_expenses
            delta_percentage_expenses
            chart
        }
    }
`;

export const BANK_EXPENSE_DISTRIBUTION_WIDGET_DATA = gql`
    query GetBankExpenseDistributionWidgetData($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID) {
        bankExpenseDistributionWidgetData(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            periodStart: $startDate,
            periodEnd: $endDate
        ) {
            category
            sub_total_amount
            percentage
        }
    }
`;

export const TOP_FIVE_BANK_ACCOUNT_DEPOSITORS_WIDGET_DATA = gql`
    query GetTopFiveBankAccountDepositorsWidgetData($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID) {
        topFiveBankAccountDepositorsWidgetData(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            periodStart: $startDate,
            periodEnd: $endDate
        ) {
            avatar_src
            name
            amount
        }
    }
`;

export const TOP_FIVE_BANK_ACCOUNT_RECIPIENTS_WIDGET_DATA = gql`
    query GetTopFiveBankAccountRecipientsWidgetData($startDate: DateTime!, $endDate: DateTime!, $merchantId: ID, $storeId: ID, $solutionId: ID) {
        topFiveBankAccountRecipientsWidgetData(
            merchantId: $merchantId,
            storeId: $storeId,
            solutionId: $solutionId,
            periodStart: $startDate,
            periodEnd: $endDate
        ) {
            avatar_src
            name
            amount
        }
    }
`;