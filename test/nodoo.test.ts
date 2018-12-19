import {
  AuthenticatedOperationResult,
  createAuthenticate,
  createAuthenticatedClient,
  createAuthenticationData,
  createClientOptions,
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
  createNameGet
} from '../src/nodoo'

import { Either } from 'fp-ts/lib/Either'

describe('Common Info Test', () => {
  it('can get common info', done => {
    const unauthenticatedClient = createUnauthenticatedClient(
      createClientOptions('13.229.83.42', 8069)
    )

    const resp = {
      server_version: '11.0',
      server_version_info: [11, 0, 0, 'final', 0, ''],
      server_serie: '11.0',
      protocol_version: 1
    }

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    unauthenticatedClient.client.methodCall = methodCallFn

    executeUnauthenticatedClient(unauthenticatedClient, createFetchCommonInformation(), callback)

    function callback(result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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
    const unauthenticatedClient = createUnauthenticatedClient(
      createClientOptions('13.229.83.42', 8069)
    )

    const errorMessage = 'An error'

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(errorMessage, null)
    })
    unauthenticatedClient.client.methodCall = methodCallFn

    executeUnauthenticatedClient(unauthenticatedClient, createFetchCommonInformation(), callback)

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
    const unauthenticatedClient = createUnauthenticatedClient(
      createClientOptions('13.229.83.42', 8069)
    )

    const resp = 1
    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    unauthenticatedClient.client.methodCall = methodCallFn

    executeUnauthenticatedClient(
      unauthenticatedClient,
      createAuthenticate(createAuthenticationData('topbrand', 'admin', 'password')),
      callback
    )

    function callback(result: Either<XMLRPCClientError, UnauthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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
    const unauthenticatedClient = createUnauthenticatedClient(
      createClientOptions('13.229.83.42', 8069)
    )

    const errorMessage = 'An error'
    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(errorMessage, null)
    })
    unauthenticatedClient.client.methodCall = methodCallFn

    executeUnauthenticatedClient(
      unauthenticatedClient,
      createAuthenticate(createAuthenticationData('topbrand', 'admin', 'password')),
      callback
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
    const authenticationData = createAuthenticationData('topbrand', 'admin', 'password')

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = [127, 126]
    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(
      authenticatedClient,
      createSearch('res.partner', [], { limit: 2, offset: 1 }),
      callback
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = 'An Error'
    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(resp, null)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(
      authenticatedClient,
      createSearch('res.partner', [], { limit: 2, offset: 1 }),
      callback
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = 7
    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(authenticatedClient, createSearchCount('res.partner', []), callback)

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = 'An Error'
    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(resp, null)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(authenticatedClient, createSearchCount('res.partner', []), callback)

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = [
      {
        id: 6,
        name: 'The Partner'
      }
    ]

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(
      authenticatedClient,
      createRead('res.partner', [[6]], ['name']),
      callback
    )

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = 'An Error'

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(resp, null)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(
      authenticatedClient,
      createRead('res.partner', [[6]], ['name']),
      callback
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = [
      { id: 3, name: 'Administrator' },
      { id: 123, name: 'Andi' },
      { id: 126, name: 'Andi' },
      { id: 124, name: 'Andi' },
      { id: 127, name: 'Andi' }
    ]

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

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = 'An Error'

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = [[3, 'Administrator']]

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

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    const resp = 'An Error'

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, creating a record returns only the ID of the created record.
    const resp = 128

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

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, creating a record returns only the ID of the created record.
    const resp = 'An Error'

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, updating a record returns a boolean.
    const resp = true

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

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, updating a record returns a boolean.
    const resp = 'An Error'

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, deleting a record returns a boolean.
    const resp = true

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(authenticatedClient, createDelete('res.partner', [[126]]), callback)

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, deleting a record returns a boolean.
    const resp = 'An Error'

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(resp, null)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(authenticatedClient, createDelete('res.partner', [[126]]), callback)

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // Default get a purchase order model returns 9 default fields
    const resp = 9

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    // authenticatedClient.client.methodCall = methodCallFn

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
              return
            case 'defaultGet': {
              expect(Object.keys(result.result).length).toBe(resp)
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, deleting a record returns a boolean.
    const resp = 'An Error'

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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // Fields get a state field in purchase order model returns 6 available selections
    const resp = 6

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    // authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(
      authenticatedClient,
      createFieldsGet('purchase.order', ['state']),
      callback
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
              return
            case 'fieldsGet': {
              expect(result.result['state']['selection'].length).toBe(resp)
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // In odoo, deleting a record returns a boolean.
    const resp = 'An Error'

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(resp, null)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(
      authenticatedClient,
      createFieldsGet('purchase.order', ['state']),
      callback
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = [[1, 'PO00001']]

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(authenticatedClient, createNameGet('purchase.order', [1]), callback)

    function callback(result: Either<XMLRPCClientError, AuthenticatedOperationResult>) {
      result.fold(
        (error: XMLRPCClientError) => {
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

    const authenticatedClient = createAuthenticatedClient(
      createClientOptions('13.229.83.42', 8069),
      authenticationData,
      1
    )

    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = 'An Error'

    const methodCallFn = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(resp, null)
    })
    authenticatedClient.client.methodCall = methodCallFn

    executeAuthenticatedClient(authenticatedClient, createNameGet('purchase.order', [1]), callback)

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
