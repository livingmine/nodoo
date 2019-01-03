import {
  AuthenticatedOperationResult,
  createAuthenticate,
  createAuthenticatedClient,
  createAuthenticationData,
  createSecureClientOptions,
  createCreate,
  createDelete,
  createFetchCommonInformation,
  createRead,
  createUpdate,
  createSearch,
  createSearchCount,
  createSearchRead,
  createNameSearch,
  createDefaultGet,
  createUnauthenticatedClient,
  executeAuthenticatedClient,
  executeUnauthenticatedClient,
  UnauthenticatedOperationResult,
  XMLRPCClientError,
  createFieldsGet,
  createNameGet,
  createOnChange,
  createInsecureClientOptions,
  createCallMethod
} from '../src/nodoo'
import { fieldsGetResult } from './methodsResult'

import { Either } from 'fp-ts/lib/Either'

describe('Client Preparation Test', () => {
  it('can create secure client', done => {
    const host = 'odoo.topbrand.rubyh.co'
    const secureClient = createSecureClientOptions(host)

    expect(secureClient).toEqual({
      kind: 'secure',
      host
    })
    done()
  })

  it('can create insecure client', done => {
    const host = 'odoo.topbrand.rubyh.co'
    const port = 8069
    const insecureClient = createInsecureClientOptions(host, port)

    expect(insecureClient).toEqual({
      kind: 'insecure',
      host,
      port
    })
    done()
  })

  it('can create secure unauthenticated client', done => {
    const host = 'odoo.topbrand.rubyh.co'
    const secureClient = createSecureClientOptions(host)

    createUnauthenticatedClient(secureClient).fold(
      error => {
        expect(error).toBe('Fail to create unauthenticated client.')
        done()
      },
      unauthenticatedClient => {
        expect(unauthenticatedClient.kind).toBe('unauthenticated')
        done()
      }
    )
  })

  it('can create secure authenticated client', done => {
    const host = 'odoo.topbrand.rubyh.co'
    const secureClient = createSecureClientOptions(host)
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')

    createAuthenticatedClient(secureClient, authenticationData, 1).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      unauthenticatedClient => {
        expect(unauthenticatedClient.kind).toBe('authenticated')
        done()
      }
    )
  })
})

describe('Common Info Test', () => {
  it('can get common info', done => {
    const resp = {
      server_version: '11.0',
      server_version_info: [11, 0, 0, 'final', 0, ''],
      server_serie: '11.0',
      protocol_version: 1
    }

    createUnauthenticatedClient(createSecureClientOptions('odoo.topbrand.rubyh.co')).fold(
      error => {
        expect(error).toBe('Fail to create unauthenticated client.')
        done()
      },
      unauthenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        unauthenticatedClient.client.methodCall = methodCallFn
        executeUnauthenticatedClient(
          unauthenticatedClient,
          createFetchCommonInformation(),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: UnauthenticatedOperationResult) => {
          switch (result.kind) {
            case 'authenticate': {
              return
            }
            case 'fetchCommonInformation': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('handle error correctly when unable to get common info', done => {
    const errorMessage = 'An error'

    createUnauthenticatedClient(createSecureClientOptions('odoo.topbrand.rubyh.co')).fold(
      error => {
        expect(error).toBe('Fail to create unauthenticated client.')
        done()
      },
      unauthenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(errorMessage, null)
        })
        unauthenticatedClient.client.methodCall = methodCallFn
        executeUnauthenticatedClient(
          unauthenticatedClient,
          createFetchCommonInformation(),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(errorMessage)
          done()
          return
        },
        (result: UnauthenticatedOperationResult) => {
          switch (result.kind) {
            case 'authenticate': {
              return
            }
            case 'fetchCommonInformation': {
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })
})

describe('Authentication Test', () => {
  it('can authenticate with correct data', done => {
    const resp = 1

    createUnauthenticatedClient(createSecureClientOptions('odoo.topbrand.rubyh.co')).fold(
      error => {
        expect(error).toBe('Fail to create unauthenticated client.')
        done()
      },
      unauthenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        unauthenticatedClient.client.methodCall = methodCallFn
        executeUnauthenticatedClient(
          unauthenticatedClient,
          createAuthenticate(createAuthenticationData('topbrand', 'admin', 'password')),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: UnauthenticatedOperationResult) => {
          switch (result.kind) {
            case 'authenticate': {
              expect(result.uid).toBe(resp)
              done()
              return
            }
            case 'fetchCommonInformation': {
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('handle error correctly when authentication fail', done => {
    const errorMessage = 'An error'

    createUnauthenticatedClient(createSecureClientOptions('odoo.topbrand.rubyh.co')).fold(
      error => {
        expect(error).toBe('Fail to create unauthenticated client.')
        done()
      },
      unauthenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(errorMessage, null)
        })
        unauthenticatedClient.client.methodCall = methodCallFn
        executeUnauthenticatedClient(
          unauthenticatedClient,
          createAuthenticate(createAuthenticationData('topbrand', 'admin', 'password')),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(errorMessage)
          done()
          return
        },
        (result: UnauthenticatedOperationResult) => {
          switch (result.kind) {
            case 'authenticate': {
              return
            }
            case 'fetchCommonInformation': {
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })
})

describe('Calling Methods Test', () => {
  it('can list records', done => {
    const resp = [127, 126]

    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createSearch('res.partner', [], { limit: 2, offset: 1 }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'search': {
              expect(result.result).toEqual(resp)
              done()
              return
            }
            case 'create':
            case 'delete':
            case 'read':
            case 'searchCount':
            case 'searchRead':
            case 'nameSearch':
            case 'update':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not list records', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createSearch('res.partner', [], { limit: 2, offset: 1 }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'search':
            case 'create':
            case 'delete':
            case 'read':
            case 'searchCount':
            case 'searchRead':
            case 'nameSearch':
            case 'update':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can count records', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = 7

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createSearchCount('res.partner', []),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'searchRead':
            case 'update':
            case 'search':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'searchCount': {
              expect(result.result).toEqual(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not count records', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createSearchCount('res.partner', []),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'searchRead':
            case 'update':
            case 'search':
            case 'nameSearch':
            case 'searchCount':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it("can read records' fields", done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = [
      {
        id: 6,
        name: 'The Partner'
      }
    ]

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createRead('res.partner', [[6]], ['name']),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'read': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it("can not read records' fields", done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createRead('res.partner', [[6]], ['name']),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'read':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it("can search and read records' fields", done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = [
      { id: 3, name: 'Administrator' },
      { id: 123, name: 'Andi' },
      { id: 126, name: 'Andi' },
      { id: 124, name: 'Andi' },
      { id: 127, name: 'Andi' }
    ]

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createSearchRead('res.partner', [], {
            fields: ['name'],
            limit: 5
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'update':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'searchRead': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it("can not search and read records' fields", done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createSearchRead('res.partner', [], {
            fields: ['name'],
            limit: 5
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'update':
            case 'nameSearch':
            case 'searchRead':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it("can search and read records' fields with name representation", done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = [[3, 'Administrator']]

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createNameSearch('res.partner', 'Admin', {
            args: [['is_company', '=', true]],
            operator: 'ilike',
            limit: 5
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'nameSearch': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it("can not search and read records' fields with name representation", done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createNameSearch('res.partner', 'Admin', {
            args: [['is_company', '=', true]],
            operator: 'ilike',
            limit: 5
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can create record', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, creating a record returns only the ID of the created record.
    const resp = 128

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createCreate('res.partner', {
            name: 'New User'
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not create record', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, creating a record returns only the ID of the created record.
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createCreate('res.partner', {
            name: 'New User'
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can update record', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, updating a record returns a boolean.
    const resp = true

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createUpdate('res.partner', [7, 8], {
            name: 'New User Again'
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'update': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not update record', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, updating a record returns a boolean.
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createUpdate('res.partner', [7, 8], {
            name: 'New User Again'
          }),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'delete':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
            case 'update': {
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can delete record', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, deleting a record returns a boolean.
    const resp = true

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createDelete('res.partner', [[126]]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (_: XMLRPCClientError) => {
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create': {
              return
            }
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'delete': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not delete record', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, deleting a record returns a boolean.
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createDelete('res.partner', [[126]]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create': {
              return
            }
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can default get a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // Default get a purchase order model returns 9 default fields
    const resp = {
      date_order: '2018-12-23 07:20:38',
      invoice_count: 0,
      currency_id: 3,
      picking_count: 0,
      name: 'New',
      state: 'draft',
      invoice_status: 'no',
      picking_type_id: 4,
      company_id: 1
    }

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createDefaultGet('purchase.order', [
            'state',
            'picking_count',
            'picking_ids',
            'invoice_count',
            'invoice_ids',
            'name',
            'partner_id',
            'partner_ref',
            'currency_id',
            'is_shipped',
            'date_order',
            'origin',
            'company_id',
            'order_line',
            'amount_untaxed',
            'amount_tax',
            'amount_total',
            'notes',
            'date_planned',
            'picking_type_id',
            'dest_address_id',
            'default_location_dest_id_usage',
            'incoterm_id',
            'invoice_status',
            'payment_term_id',
            'fiscal_position_id',
            'date_approve',
            'message_follower_ids',
            'activity_ids',
            'message_ids'
          ]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          console.log(error)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'defaultGet': {
              expect(Object.keys(result.result).length).toBe(9)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not default get a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, deleting a record returns a boolean.
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createDefaultGet('purchase.order', [
            'state',
            'picking_count',
            'picking_ids',
            'invoice_count',
            'invoice_ids',
            'name',
            'partner_id',
            'partner_ref',
            'currency_id',
            'is_shipped',
            'date_order',
            'origin',
            'company_id',
            'order_line',
            'amount_untaxed',
            'amount_tax',
            'amount_total',
            'notes',
            'date_planned',
            'picking_type_id',
            'dest_address_id',
            'default_location_dest_id_usage',
            'incoterm_id',
            'invoice_status',
            'payment_term_id',
            'fiscal_position_id',
            'date_approve',
            'message_follower_ids',
            'activity_ids',
            'message_ids'
          ]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can fields get a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    const resp = fieldsGetResult

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createFieldsGet('purchase.order', []),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          console.log(error)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            case 'fieldsGet': {
              expect(result.result).toEqual(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not fields get a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // In odoo, deleting a record returns a boolean.
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createFieldsGet('purchase.order', ['state']),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create': {
              return
            }
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'onChange':
            case 'callMethod':
              return
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can name get a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = [[1, 'PO00001']]

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createNameGet('purchase.order', [1]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          console.log(error)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'onChange':
            case 'callMethod':
            case 'nameGet': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not name get a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createNameGet('purchase.order', [1]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'onChange':
            case 'callMethod':
            case 'nameGet': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can onchange a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // The first onchange when opening the purchase order form returns the following object
    const resp = {
      value: {
        default_location_dest_id_usage: 'internal',
        currency_id: false
      }
    }

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createOnChange(
            'purchase.order',
            {
              state: 'draft',
              picking_count: 0,
              invoice_count: 0,
              name: 'New',
              currency_id: 3,
              date_order: '2018-12-19 04:51:04',
              company_id: 1,
              picking_type_id: 4,
              invoice_status: 'no',
              picking_ids: [[6, false, []]],
              invoice_ids: [[6, false, []]],
              partner_id: false,
              partner_ref: false,
              is_shipped: false,
              origin: false,
              order_line: [],
              amount_untaxed: 0,
              amount_tax: 0,
              amount_total: 0,
              notes: false,
              date_planned: false,
              dest_address_id: false,
              default_location_dest_id_usage: false,
              incoterm_id: false,
              payment_term_id: false,
              fiscal_position_id: false,
              date_approve: false,
              message_follower_ids: [],
              activity_ids: [],
              message_ids: []
            },
            [
              'state',
              'picking_count',
              'picking_ids',
              'invoice_count',
              'invoice_ids',
              'name',
              'partner_id',
              'partner_ref',
              'currency_id',
              'is_shipped',
              'date_order',
              'origin',
              'company_id',
              'order_line',
              'amount_untaxed',
              'amount_tax',
              'amount_total',
              'notes',
              'date_planned',
              'picking_type_id',
              'dest_address_id',
              'default_location_dest_id_usage',
              'incoterm_id',
              'invoice_status',
              'payment_term_id',
              'fiscal_position_id',
              'date_approve',
              'message_follower_ids',
              'activity_ids',
              'message_ids'
            ],
            {
              state: '1',
              picking_count: '',
              picking_ids: '1',
              invoice_count: '',
              invoice_ids: '',
              name: '',
              partner_id: '1',
              partner_ref: '',
              currency_id: '1',
              is_shipped: '',
              date_order: '',
              origin: '',
              company_id: '1',
              order_line: '1',
              'order_line.currency_id': '',
              'order_line.state': '',
              'order_line.sequence': '',
              'order_line.product_id': '1',
              'order_line.name': '',
              'order_line.move_dest_ids': '',
              'order_line.date_planned': '1',
              'order_line.company_id': '',
              'order_line.account_analytic_id': '',
              'order_line.analytic_tag_ids': '',
              'order_line.product_qty': '1',
              'order_line.qty_received': '1',
              'order_line.qty_invoiced': '1',
              'order_line.product_uom': '1',
              'order_line.price_unit': '1',
              'order_line.taxes_id': '1',
              'order_line.price_subtotal': '',
              'order_line.invoice_lines': '1',
              'order_line.move_ids': '1',
              amount_untaxed: '',
              amount_tax: '',
              amount_total: '',
              notes: '',
              date_planned: '',
              picking_type_id: '1',
              dest_address_id: '',
              default_location_dest_id_usage: '',
              incoterm_id: '',
              invoice_status: '',
              payment_term_id: '',
              fiscal_position_id: '1',
              date_approve: '',
              message_follower_ids: '',
              activity_ids: '',
              message_ids: ''
            }
          ),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          console.log(error)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'callMethod':
              return
            case 'onChange': {
              expect(result.result).toEqual(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not onchange a model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // The first onchange when opening the purchase order form returns the following object
    const resp = 'An Error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createOnChange(
            'purchase.order',
            {
              state: 'draft',
              picking_count: 0,
              invoice_count: 0,
              name: 'New',
              currency_id: 3,
              date_order: '2018-12-19 04:51:04',
              company_id: 1,
              picking_type_id: 4,
              invoice_status: 'no',
              picking_ids: [[6, false, []]],
              invoice_ids: [[6, false, []]],
              partner_id: false,
              partner_ref: false,
              is_shipped: false,
              origin: false,
              order_line: [],
              amount_untaxed: 0,
              amount_tax: 0,
              amount_total: 0,
              notes: false,
              date_planned: false,
              dest_address_id: false,
              default_location_dest_id_usage: false,
              incoterm_id: false,
              payment_term_id: false,
              fiscal_position_id: false,
              date_approve: false,
              message_follower_ids: [],
              activity_ids: [],
              message_ids: []
            },
            [
              'state',
              'picking_count',
              'picking_ids',
              'invoice_count',
              'invoice_ids',
              'name',
              'partner_id',
              'partner_ref',
              'currency_id',
              'is_shipped',
              'date_order',
              'origin',
              'company_id',
              'order_line',
              'amount_untaxed',
              'amount_tax',
              'amount_total',
              'notes',
              'date_planned',
              'picking_type_id',
              'dest_address_id',
              'default_location_dest_id_usage',
              'incoterm_id',
              'invoice_status',
              'payment_term_id',
              'fiscal_position_id',
              'date_approve',
              'message_follower_ids',
              'activity_ids',
              'message_ids'
            ],
            {
              state: '1',
              picking_count: '',
              picking_ids: '1',
              invoice_count: '',
              invoice_ids: '',
              name: '',
              partner_id: '1',
              partner_ref: '',
              currency_id: '1',
              is_shipped: '',
              date_order: '',
              origin: '',
              company_id: '1',
              order_line: '1',
              'order_line.currency_id': '',
              'order_line.state': '',
              'order_line.sequence': '',
              'order_line.product_id': '1',
              'order_line.name': '',
              'order_line.move_dest_ids': '',
              'order_line.date_planned': '1',
              'order_line.company_id': '',
              'order_line.account_analytic_id': '',
              'order_line.analytic_tag_ids': '',
              'order_line.product_qty': '1',
              'order_line.qty_received': '1',
              'order_line.qty_invoiced': '1',
              'order_line.product_uom': '1',
              'order_line.price_unit': '1',
              'order_line.taxes_id': '1',
              'order_line.price_subtotal': '',
              'order_line.invoice_lines': '1',
              'order_line.move_ids': '1',
              amount_untaxed: '',
              amount_tax: '',
              amount_total: '',
              notes: '',
              date_planned: '',
              picking_type_id: '1',
              dest_address_id: '',
              default_location_dest_id_usage: '',
              incoterm_id: '',
              invoice_status: '',
              payment_term_id: '',
              fiscal_position_id: '1',
              date_approve: '',
              message_follower_ids: '',
              activity_ids: '',
              message_ids: ''
            }
          ),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'nameGet':
            case 'callMethod':
              return
            case 'onChange': {
              expect(result.result).toEqual(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can call a method of the model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // Call the copy method of a purchase order model returns the id of the record
    const resp = 82

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(null, resp)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createCallMethod('purchase.order', 'copy', [[62]]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'onChange':
            case 'callMethod':
            case 'nameGet': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })

  it('can not call a method of the model', done => {
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')
    // Call the copy method of a purchase order model returns the id of the record
    const resp = 'An error'

    createAuthenticatedClient(
      createSecureClientOptions('odoo.topbrand.rubyh.co'),
      authenticationData,
      1
    ).fold(
      error => {
        expect(error).toBe('Fail to create authenticated client.')
        done()
      },
      authenticatedClient => {
        const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
          callback(resp, null)
        })
        authenticatedClient.client.methodCall = methodCallFn
        executeAuthenticatedClient(
          authenticatedClient,
          createCallMethod('purchase.order', 'copy', [[62]]),
          callback
        )
      }
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
          expect(error).toBe(resp)
          done()
          return
        },
        (result: AuthenticatedOperationResult) => {
          switch (result.kind) {
            case 'create':
            case 'read':
            case 'search':
            case 'searchCount':
            case 'searchRead':
            case 'update':
            case 'nameSearch':
            case 'delete':
            case 'defaultGet':
            case 'fieldsGet':
            case 'onChange':
            case 'callMethod':
            case 'nameGet': {
              expect(result.result).toBe(resp)
              done()
              return
            }
            default:
              const exhaustiveCheck: never = result
          }
        }
      )
    }
  })
})
