import { gql } from '@apollo/client'

export const GET_ACQUIRING_SERVICE = gql`
    query AcquiringService($id: ID!) {
        acquiringService(id: $id) {
            data {
                id
                attributes {
                    provider {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    partner {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`

export const GET_GATEWAY_SERVICE = gql`
    query GatewayService($id: ID!) {
        gatewayService(id: $id) {
            data {
                id
                attributes {
                    provider {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    partner {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`

export const GET_TERMINAL_SERVICE = gql`
    query GatewayService($id: ID!) {
        gatewayService(id: $id) {
            data {
                id
                attributes {
                    provider {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    partner {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`