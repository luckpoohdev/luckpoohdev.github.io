import { gql } from '@apollo/client'

export const GET_SOLUTION_GENERAL_DATA = gql`
    query GeneralSolutionData($id: ID!) {
        solution(id: $id) {
            data {
                id
                attributes {
                    type
                    name
                    acquiring_services {
                        data {
                            id
                            attributes {
                                name
                                cards {
                                    type
                                }
                                provider {
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
                                partner {
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
                        }
                    }
                    gateway_service {
                        data {
                            id
                            attributes {
                                name
                                third_parties {
                                    service {
                                        data {
                                            attributes {
                                                third_party_provider {
                                                    data {
                                                        attributes {
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
                                provider {
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
                                partner {
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
                        }
                    }
                    terminal_service {
                        data {
                            id
                            attributes {
                                name
                                terminal_type
                                terminals {
                                    technology
                                    model
                                }
                                provider {
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
                                partner {
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
                        }
                    }
                }
            }
        }
    }
`

export const GET_SOLUTIONS = gql`
  query Solutions($storeId: ID, $merchantId: ID) {
    solutions(
      filters: {
        or: [
          { store: { id: { eq: $storeId } } }
          { store: { merchant: { id: { eq: $merchantId } } } }
        ]
      }
    ) {
      data {
        id
        attributes {
          name
          type
          acquiring_service_agreements {
            data {
              attributes {
                integration_link {
                  data {
                    id
                    attributes {
                      integration {
                        data {
                          id
                          attributes {
                            name
                            slug
                            auth_url
                            scraper_auth_config
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
                acquiring_service {
                  data {
                    attributes {
                      provider {
                        data {
                          attributes {
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
                      partner {
                        data {
                          attributes {
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
                integration_link {
                  data {
                    id
                    attributes {
                      integration {
                        data {
                          id
                          attributes {
                            name
                            slug
                            auth_url
                            scraper_auth_config
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
                gateway_service {
                  data {
                    attributes {
                      provider {
                        data {
                          attributes {
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
                      partner {
                        data {
                          attributes {
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
                integration_link {
                  data {
                    id
                    attributes {
                      integration {
                        data {
                          id
                          attributes {
                            name
                            slug
                            auth_url
                            scraper_auth_config
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
                terminal_service {
                  data {
                    attributes {
                      provider {
                        data {
                          attributes {
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
                      partner {
                        data {
                          attributes {
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
`

export const GET_SOLUTION_NAME = gql`
    query GeneralSolutionData($id: ID!, $merchantId: ID!) {
        solutions(filters: { and: [ { id: { eq: $id } }, { store: { merchant: { id: { eq: $merchantId } } } } ] }) {
            data {
                id
                attributes {
                    name
                }
            }
        }
    }
`

export const GET_AVAILABLE_INTEGRATIONS = gql`
    query AvailableIntegrations($solutionId: ID!) {
        integrations(
            filters: {
                integration_links: { or: [ { id: null }, { solution: { id: { ne: $solutionId }  } } ] }
                type: { in: ["acquiring", "gateway"] }
            },
            sort: "name:asc"
        ) {
            data {
                id
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

export const GET_SOLUTION_INTEGRATIONS = gql`
    query IntegrationLinks($solutionId: ID!) {
        integrationLinks(filters: { gateway_service_agreement: { solution: { id: { eq: $solutionId } } } }) {
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