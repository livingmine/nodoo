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
  createFieldsGet,
  createNameGet,
  createOnChange,
  createInsecureClientOptions,
  createCallMethod,
  createGetVersion,
  createDBExist,
  createListDB,
  createServiceOperationError,
  createAuthenticateCredentials,
  createDB,
  createService,
  OdooJSONRPCError,
  statusCodeToExceptionType
} from '../src/nodoo'
import { fieldsGetResult } from './methodsResult'

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
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('can get common info', done => {
    const resp = {
      server_version: '11.0',
      server_version_info: [11, 0, 0, 'final', 0, ''],
      server_serie: '11.0',
      protocol_version: 1
    }

    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createGetVersion()

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can authenticate with correct data', done => {
    const resp = {
      max_time_between_keys_in_ms: 55,
      username: 'admin',
      uid: 1,
      user_context: {
        tz: false,
        uid: 1,
        lang: 'en_US'
      },
      is_superuser: true,
      session_id: '4c2ba2db2828d405d5c4145a6da7cb4447397a3c',
      db: 'dbname',
      server_version: '11.0',
      partner_id: 3,
      'web.base.url': 'http://weburl.com/',
      currencies: {
        '13': {
          position: 'before',
          digits: [69, 2],
          symbol: 'Rp'
        }
      },
      company_id: 1,
      user_companies: false,
      is_system: true,
      server_version_info: [11, 0, 0, 'final', 0, ''],
      name: 'Administrator',
      web_tours: []
    }

    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

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

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('handle error correctly when authentication fail', done => {
    // Authentication service returns the following on invalid credentials
    const resp = {
      company_id: null,
      currencies: {},
      db: 'dbname',
      is_superuser: false,
      is_system: false,
      max_time_between_keys_in_ms: 55,
      name: false,
      partner_id: null,
      server_version: '11.0',
      server_version_info: [11, 0, 0, 'final', 0, ''],
      session_id: 'a4db275aa69ee55c01a67798c36e8e7473389e16',
      uid: false,
      user_companies: false,
      user_context: {},
      username: false,
      'web.base.url': 'http://weburl.com/'
    }
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

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

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })
})

describe('Model Service Test', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('can list records', done => {
    const resp = [18, 9]
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )
    // Uncomment this to un-mock the fetch functionality
    // fetchMock.mockImplementationOnce(require.requireActual('cross-fetch').default)

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createSearch({
      modelName: 'res.partner',
      domain: [],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can count records', done => {
    const resp = 7
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createSearchCount({
      modelName: 'res.partner',
      searchDomain: [],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it("can read records' fields by specifying list of fields to read", done => {
    const resp = [
      {
        id: 6,
        name: 'Portal User Template'
      }
    ]
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createRead({
      modelName: 'res.partner',
      ids: [6],
      fields: ['name'],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it("can read records' fields without specifying list of fields to read", done => {
    // The actual resp shows way more fields than below
    const resp = [
      {
        id: 6,
        name: 'Portal User Template'
      }
    ]
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createRead({
      modelName: 'res.partner',
      ids: [6],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can create record', done => {
    // In odoo, creating a record returns only the ID of the created record.
    const resp = 42
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createCreate({
      modelName: 'res.partner',
      fieldsValues: {
        name: 'New User'
      },
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can update record', done => {
    // In odoo, updating a record returns a boolean.
    const resp = true
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createUpdate({
      modelName: 'res.partner',
      ids: [99999],
      fieldsValues: {
        id: 11,
        name: 'Buyer Tokopedia'
      },
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can delete record', done => {
    // In odoo, deleting a record returns a boolean.
    const resp = true
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createDelete({
      modelName: 'res.partner',
      ids: [9999],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it("can search and read records' fields", done => {
    const resp = {
      length: 5,
      records: [
        { id: 3, name: 'Administrator' },
        { id: 123, name: 'Andi' },
        { id: 126, name: 'Andi' },
        { id: 124, name: 'Andi' },
        { id: 127, name: 'Andi' }
      ]
    }
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createSearchRead({
      modelName: 'res.partner',
      domain: [],
      fields: ['name'],
      limit: 5,
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it("can search and read records' fields with name representation", done => {
    const resp = [[3, 'Administrator']]
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createNameSearch({
      modelName: 'res.partner',
      nameToSearch: 'Admin',
      limit: 5,
      operator: 'ilike',
      searchDomain: [['is_company', '=', false]],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
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
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
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
      ],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can fields get a model', done => {
    const resp = fieldsGetResult
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createFieldsGet({
      modelName: 'purchase.order',
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can fields get a model by specifying which fields to get', done => {
    const resp = (({ invoice_count, picking_ids }) => ({ invoice_count, picking_ids }))(
      fieldsGetResult
    )
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createFieldsGet({
      modelName: 'purchase.order',
      fieldsNames: ['invoice_count', 'picking_ids'],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can name get a model', done => {
    // Name get a purchase order model returns array of one array of the id and the name of the record
    const resp = [[1, 'PO00001']]
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createNameGet({
      modelName: 'purchase.order',
      ids: [1],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
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
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
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
      },
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can call a method of the model', done => {
    // Call the copy method of a purchase order model returns the id of the record
    const resp = 46
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createCallMethod({
      modelName: 'purchase.order',
      methodName: 'copy',
      args: [[46]],
      sessionToken: 'bd697b2dba6ec1cd1f79c504cd280bb9040a788e'
    })

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })
})

describe('DB Service Test', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('can check a db existence by its name', done => {
    const resp = true

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createDBExist({
      dbName: 'topbrand'
    })

    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can list available databases', done => {
    const resp = ['a_name_of_db', 'another_name_of_db']

    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

    const clientOptions = createSecureClientOptions({
      host: 'odoo.topbrand.rubyh.co'
    })

    const operation = createListDB()

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })

  it('can create a database', done => {
    const resp = true
    fetchMock.mockResponseOnce(
      JSON.stringify({
        result: resp
      })
    )

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

    createService({
      operation,
      clientOptions
    }).addListener({
      next: result => {
        result.fold(
          (error: any) => {
            expect(error).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          },
          (data: any) => {
            expect(data).toEqual(resp)
            expect(fetchMock.mock.calls.length).toEqual(1)
            done()
          }
        )
      },
      error: error => {
        expect(error).toEqual(resp)
        done()
      },
      complete: () => {
        done()
      }
    })
  })
})

describe('Service Operation Error Preparation Test', () => {
  it('can convert status code to the right exception type', done => {
    const statusCode = 200
    const exceptionType = 'access_error'

    const generatedExceptionType = statusCodeToExceptionType(statusCode, exceptionType)
    expect(generatedExceptionType).toBe('access_error')
    done()
  })

  it('can create an user error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'user_error',
        message: 'Some user error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('userError')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })

  it('can create a warning error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'warning',
        message: 'Some warning error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('warning')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })

  it('can create an access error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'access_error',
        message: 'Some access error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('accessError')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })

  it('can create a missing error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'missing_error',
        message: 'Some missing error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('missingError')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })

  it('can create an access denied error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'access_denied',
        message: 'Some access denied error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('accessDenied')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })

  it('can create a validation error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'validation_error',
        message: 'Some validation error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('validationError')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })

  it('can create a except ORM error operation error', done => {
    const odooJSONRPCError: OdooJSONRPCError = {
      code: 200,
      data: {
        arguments: [],
        debug: '',
        exception_type: 'except_orm',
        message: 'Some except ORM error message.',
        name: ''
      },
      message: 'Odoo Server Error'
    }

    const serviceOperationError = createServiceOperationError({
      error: odooJSONRPCError
    })

    expect(serviceOperationError.kind).toBe('exceptORM')
    expect(serviceOperationError.message).toBe(odooJSONRPCError.data.message)
    done()
  })
})
