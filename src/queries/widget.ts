import { gql } from '@apollo/client';

export const GET_REVENUE_WIDGET_DATA = gql`
    query RevenueWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getRevenueWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total
            previous_period_total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_PAYMENT_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query PaymentCostsOverviewWidget($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getPaymentCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            avg_percentage
            avg_percentage_delta
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_ACQUIRING_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query AcquiringCostsOverviewWidget($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getAcquiringCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            avg_percentage
            avg_percentage_delta
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_GATEWAY_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query GatewayCostsOverviewWidget($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getGatewayCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            avg_percentage
            avg_percentage_delta
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_AVERAGE_PURCHASE_WIDGET_DATA = gql`
    query AveragePurchaseWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getAveragePurchaseWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            average_purchase_price
            average_purchase_price_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_CUSTOMER_DISTRIBUTION_WIDGET_DATA = gql`
    query CustomerDistributionWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getCustomerDistributionWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            new_customers_percentage
            repeat_customers_percentage
        }
    }
`

export const GET_PAYMENT_METHOD_DISTRIBUTION_WIDGET_DATA = gql`
    query PaymentMethodDistributionWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getPaymentMethodDistributionWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            payment_methods {
                payment_method
                sum_amount
                percentage
            }
        }
    }
`

export const GET_SALES_DISTRIBUTION_WIDGET_DATA = gql`
    query SalesDistributionWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getSalesDistributionWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			status
            num
            percentage
        }
    }
`

export const GET_REGIONAL_SALES_DISTRIBUTION_WIDGET_DATA = gql`
    query RegionalSalesDistributionWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getRegionalSalesDistributionWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			countries {
                sum_total
                region
            }
            total
        }
    }
`

export const GET_INTEGRATIONS_LIST_WIDGET_DATA = gql`
    query IntegrationsListWidgetData($storeId: ID) {
        getIntegrationsListWidgetData(
            storeId: $storeId
        ) {
			integration_name
			integration_logo_url
			integration_link_id
			active
			healthy
			solution_name
			solution_id
			store_name
			store_id
			merchant_name
			merchant_id
        }
    }
`

export const GET_COMPLETED_SALES_WIDGET_DATA = gql`
    query CompletedSalesWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getCompletedSalesWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_FAILED_SALES_WIDGET_DATA = gql`
    query FailedSalesWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getFailedSalesWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_RETURNED_SALES_WIDGET_DATA = gql`
    query ReturnedSalesWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getReturnedSalesWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_PROCESSING_SALES_WIDGET_DATA = gql`
    query ProcessingSalesWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getProcessingSalesWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_PARTIALLY_RETURNED_SALES_WIDGET_DATA = gql`
    query PartiallyReturnedSalesWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getPartiallyReturnedSalesWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_COMPLETED_SALES_DISTRIBUTION_WIDGET_DATA = gql`
    query CompletedSalesDistributionWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getCompletedSalesDistributionWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			num_completed_sales
            num_paid_sales
        }
    }
`

export const GET_SALES_NUMBERS_WIDGET_DATA = gql`
    query SalesNumbersWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getSalesNumbersWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_CARD_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query CardCostsOverviewWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getCardCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            type
            cost_pct
            sub_brands {
                sub_brand
                cost_pct
            }
        }
    }
`

export const GET_THIRD_PARTY_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query ThirdPartyCostsOverviewWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getThirdPartyCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            type
            cost_pct
        }
    }
`

export const GET_DETAILED_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query DetailedCostsOverviewWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getDetailedCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            data
        }
    }
`

export const GET_DETAILED_COSTS_SHARE_OVERVIEW_WIDGET_DATA = gql`
    query DetailedCostsShareOverviewWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getDetailedCostsShareOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            value
            percentage
            label
        }
    }
`

export const GET_CARD_SPLIT_COSTS_OVERVIEW_WIDGET_DATA = gql`
    query CardSplitCostsOverviewWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getCardSplitCostsOverviewWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total
            cards {
                value
                label
                icon_url
            }
        }
    }
`

export const GET_PAID_TRANSACTIONS_WIDGET_DATA = gql`
    query PaidTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getPaidTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_SETTLED_TRANSACTIONS_WIDGET_DATA = gql`
    query SettledTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getSettledTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_AUTHORIZED_TRANSACTIONS_WIDGET_DATA = gql`
    query AuthorizedTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getAuthorizedTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_REFUNDED_TRANSACTIONS_WIDGET_DATA = gql`
    query RefundedTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getRefundedTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_RETURNED_TRANSACTIONS_WIDGET_DATA = gql`
    query ReturnedTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getReturnedTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_ABANDONED_CHECKOUTS_WIDGET_DATA = gql`
    query AbandonedCheckoutsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getAbandonedCheckoutsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_FAILED_TRANSACTIONS_WIDGET_DATA = gql`
    query FailedTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getFailedTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_3DS_FAILED_TRANSACTIONS_WIDGET_DATA = gql`
    query ThreeDsFailedTransactionsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getThreeDsFailedTransactionsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
			total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_TRANSACTIONS_NUMBERS_WIDGET_DATA = gql`
    query TransactionsNumbersWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getTransactionsNumbersWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_FAILED_TRANSACTIONS_DISTRIBUTION_WIDGET_DATA = gql`
    query FailedTransactionsDistributionWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getFailedTransactionsDistributionWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            num_failed_settlements
            num_failed_authorizations
        }
    }
`

export const GET_ACQUIRING_ERRORS_WIDGET_DATA = gql`
    query AcquiringErrorsWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getAcquiringErrorsWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total
            total_delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_REPEAT_CUSTOMER_NUMBERS_WIDGET_DATA = gql`
    query RepeatCustomerNumbersWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getRepeatCustomerNumbersWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`;

export const GET_RETURN_RATE_WIDGET_DATA = gql`
    query ReturnRateWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getReturnRateWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total_percentage
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`;

export const GET_ERROR_RATE_WIDGET_DATA = gql`
    query ErrorRateWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getErrorRateWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total_percentage
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`;

export const GET_THREEDS_ERROR_RATE_WIDGET_DATA = gql`
    query ThreedsErrorRateWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getThreedsErrorRateWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total_percentage
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_ACQUIRING_ERROR_RATE_WIDGET_DATA = gql`
    query AcquiringErrorRateWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getAcquiringErrorRateWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total_percentage
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`

export const GET_REPEAT_CUSTOMER_NUMBERS_PERCENTAGE_WIDGET_DATA = gql`
    query RepeatCustomerNumbersPercentageWidgetData($merchantId: ID, $storeId: ID, $startPeriod: DateTime!, $endPeriod: DateTime!, $selectedPeriod: String!) {
        getRepeatCustomerNumbersPercentageWidgetData(
            merchantId: $merchantId
            storeId: $storeId
            startPeriod: $startPeriod
            endPeriod: $endPeriod
            selectedPeriod: $selectedPeriod
        ) {
            total_percentage
            delta_percentage
            chart {
                series {
                    data
                }
            }
        }
    }
`;