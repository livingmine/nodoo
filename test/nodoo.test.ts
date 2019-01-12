import {
  createAuthenticate,
  createSecureClientOptions,
  createCreate,
  createDelete,
  createRead,
  createUpdate,
  createSearch,
  createSearchCount,
  createSearchRead,
  createNameSearch,
  createDefaultGet,
  XMLRPCClientError,
  createFieldsGet,
  createNameGet,
  createOnChange,
  createInsecureClientOptions,
  createCallMethod,
  createCommonService,
  createGetVersion,
  executeService,
  ServiceOperationResult,
  createModelService,
  ServiceOperationError,
  createDBService,
  createDBExist,
  createListDB,
  createServiceOperationError,
  createAuthenticateCredentials,
  createModelServiceCredentials,
  createDB
} from '../src/nodoo'
import { fieldsGetResult } from './methodsResult'

import { Either } from 'fp-ts/lib/Either'

describe('Client Preparation Test', () => {
  it('can create secure client', done => {
    const host = 'odoo.topbrand.rubyh.co'
    const secureClient = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    expect(secureClient).toEqual({
      kind: 'secure',
      host
    })
    done()
  })

  it('can create insecure client', done => {
    const host = 'odoo.topbrand.rubyh.co'
    const port = 8069
    const insecureClient = createInsecureClientOptions({
      host: 'odoo.topbrand.rubyh.co',
      port: 8069
    })

    expect(insecureClient).toEqual({
      kind: 'insecure',
      host,
      port
    })
    done()
  })
})

describe('Common Service Test', () => {
  it('can get common info', done => {
    const resp = {
      server_version: '11.0',
      server_version_info: [11, 0, 0, 'final', 0, ''],
      server_serie: '11.0',
      protocol_version: 1
    }

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createGetVersion()

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const getVersionService = createCommonService({
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service: getVersionService,
      callback
    })
  })

  it('can authenticate with correct data', done => {
    const resp = 1

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createAuthenticate({
      credentials: createAuthenticateCredentials({
        db: 'topbrand',
        username: 'admin',
        password: 'password'
      })
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createCommonService({
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('handle error correctly when authentication fail', done => {
    // Authentication service returns false on invalid credentials
    const resp = false

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createAuthenticateCredentials({
      db: 'topbrand',
      username: 'admin',
      password: 'wrongpassword'
    })

    const operation = createAuthenticate({
      credentials
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createCommonService({
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })
})

describe('Model Service Test', () => {
  it('can list records', done => {
    const resp = [18, 9]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createSearch({
      modelName: 'res.partner',
      searchDomain: [],
      optionalParameters: { limit: 2, offset: 1 }
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can not list records', done => {
    const XMLRPCClientError = {
      faultCode: 3,
      faultString: 'Access denied'
    }

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'passwordz'
    })

    const operation = createSearch({
      modelName: 'res.partner',
      searchDomain: [],
      optionalParameters: { limit: 2, offset: 1 }
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(XMLRPCClientError, null)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (error: ServiceOperationError) => {
          expect(error.message).toEqual(XMLRPCClientError.faultString)
          done()
          return
        },
        (result: ServiceOperationResult) => {
          return
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can count records', done => {
    const resp = 7

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createSearchCount({
      modelName: 'res.partner',
      searchDomain: []
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it("can read records' fields by specifying list of fields to read", done => {
    const resp = [
      {
        id: 6,
        name: 'The Partner'
      }
    ]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createRead({
      modelName: 'res.partner',
      ids: [[6]],
      fields: ['name']
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it("can read records' fields without specifying list of fields to read", done => {
    // The actual resp shows way more fields than below
    const resp = [
      {
        id: 6,
        name: 'The Partner'
      }
    ]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createRead({
      modelName: 'res.partner',
      ids: [[6]]
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it("can search and read records' fields", done => {
    const resp = [
      { id: 3, name: 'Administrator' },
      { id: 123, name: 'Andi' },
      { id: 126, name: 'Andi' },
      { id: 124, name: 'Andi' },
      { id: 127, name: 'Andi' }
    ]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createSearchRead({
      modelName: 'res.partner',
      searchDomain: [],
      optionalParameters: {
        fields: ['name'],
        limit: 5
      }
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it("can search and read records' fields with name representation", done => {
    const resp = [[3, 'Administrator']]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createNameSearch({
      modelName: 'res.partner',
      nameToSearch: 'Admin',
      optionalParameters: {
        args: [['is_company', '=', true]],
        operator: 'ilike',
        limit: 5
      }
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can create record', done => {
    // In odoo, creating a record returns only the ID of the created record.
    const resp = 42

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createCreate({
      modelName: 'res.partner',
      fieldsValues: {
        name: 'New User'
      }
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can update record', done => {
    // In odoo, updating a record returns a boolean.
    const resp = true

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createUpdate({
      modelName: 'res.partner',
      ids: [32, 33],
      fieldsValues: {
        name: 'New User Again'
      }
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can delete record', done => {
    // In odoo, deleting a record returns a boolean.
    const resp = true

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createDelete({
      modelName: 'res.partner',
      ids: [[126]]
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can default get a model', done => {
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

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createDefaultGet({
      modelName: 'purchase.order',
      fieldsNames: [
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
      ]
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(Object.keys(result).length).toBe(9)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can fields get a model', done => {
    const resp = fieldsGetResult

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createFieldsGet({
      modelName: 'purchase.order'
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can fields get a model by specifying which fields to get', done => {
    const resp = (({ invoice_count, picking_ids }) => ({ invoice_count, picking_ids }))(
      fieldsGetResult
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createFieldsGet({
      modelName: 'purchase.order',
      fieldsNames: ['invoice_count', 'picking_ids']
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can name get a model', done => {
    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = [[1, 'PO00001']]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createNameGet({
      modelName: 'purchase.order',
      ids: [1]
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can onchange a model', done => {
    // The first onchange when opening the purchase order form returns the following object
    const resp = {
      value: {
        default_location_dest_id_usage: 'internal',
        currency_id: false
      }
    }

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createOnChange({
      modelName: 'purchase.order',
      values: {
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
      fieldName: [
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
      fieldOnChange: {
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
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can call a method of the model', done => {
    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = [[1, 'PO00001']]

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    // createCallMethod('stock.picking', 'button_validate', [[1]]),
    const operation = createCallMethod({
      modelName: 'stock.picking.type',
      methodName: 'copy',
      args: [[1]]
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can call a method of the model', done => {
    // Call the copy method of a purchase order model returns the id of the record
    const resp = 82

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const credentials = createModelServiceCredentials({
      db: 'topbrand',
      uid: 1,
      password: 'password'
    })

    const operation = createCallMethod({
      modelName: 'purchase.order',
      methodName: 'copy',
      args: [[62]]
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createModelService({
      credentials,
      clientOptions,
      operation,
      mockMethodCall
    })

    executeService({
      service,
      callback
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }
  })
})

describe('DB Service Test', () => {
  it('can check a db existence by its name', done => {
    const resp = true

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createDBExist({
      dbName: 'topbrand'
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createDBService({
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can list available databases', done => {
    const resp = ['a_name_of_db', 'another_name_of_db']

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createListDB()

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createDBService({
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })

  it('can create a database', done => {
    const resp = true

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createDB({
      adminPassword: 'admin',
      countryCode: 'ID',
      dbName: 'a_new_db_name',
      demo: false,
      lang: 'en_US',
      login: 'admin',
      userPassword: 'password'
    })

    const mockMethodCall = jest.fn().mockImplementation((firstArg, secondArg, callback) => {
      callback(null, resp)
    })

    const service = createDBService({
      operation,
      clientOptions,
      mockMethodCall
    })

    function callback(result: Either<ServiceOperationError, ServiceOperationResult>) {
      result.fold(
        (_: ServiceOperationError) => {
          return
        },
        (result: ServiceOperationResult) => {
          expect(result).toEqual(resp)
          done()
        }
      )
    }

    executeService({
      service,
      callback
    })
  })
})

describe('Service Operation Error Preparation Test', () => {
  it('can create an aplication error operation error', done => {
    const applicationError: XMLRPCClientError = {
      body: {},
      req: {},
      res: {},
      faultCode: 1,
      faultString: 'This will be transformed to message field'
    }

    const serviceOperationError = createServiceOperationError({
      error: applicationError
    })

    expect(serviceOperationError.kind).toBe('application')
    expect(serviceOperationError.message).toBe(applicationError.faultString)
    done()
  })

  it('can create a warning operation error', done => {
    const warning: XMLRPCClientError = {
      body: {},
      req: {},
      res: {},
      faultCode: 2,
      faultString: 'This will be transformed to message field'
    }

    const serviceOperationError = createServiceOperationError({
      error: warning
    })

    expect(serviceOperationError.kind).toBe('warning')
    expect(serviceOperationError.message).toBe(warning.faultString)
    done()
  })

  it('can create an access denied operation error', done => {
    const accessDenied: XMLRPCClientError = {
      body: {},
      req: {},
      res: {},
      faultCode: 3,
      faultString: 'This will be transformed to message field'
    }

    const serviceOperationError = createServiceOperationError({
      error: accessDenied
    })

    expect(serviceOperationError.kind).toBe('accessDenied')
    expect(serviceOperationError.message).toBe(accessDenied.faultString)
    done()
  })

  it('can create an access error operation error', done => {
    const accessError: XMLRPCClientError = {
      body: {},
      req: {},
      res: {},
      faultCode: 4,
      faultString: 'This will be transformed to message field'
    }

    const serviceOperationError = createServiceOperationError({
      error: accessError
    })

    expect(serviceOperationError.kind).toBe('accessError')
    expect(serviceOperationError.message).toBe(accessError.faultString)
    done()
  })
})
