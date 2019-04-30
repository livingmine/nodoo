import { BaseClient, BaseClientOptions } from './client'
import { ServiceOperation } from '../controllers/controller'

export interface InsecureClient extends BaseClient {
  kind: 'insecure'
}

export interface InsecureClientOptions extends BaseClientOptions {
  kind: 'insecure'
  port: number
}

type InsecureClientOptionsParams = {
  host: string
  port: number
}

export const createInsecureClientOptions = (
  clientOptionsParams: InsecureClientOptionsParams
): InsecureClientOptions => {
  const insecureClientOptions: InsecureClientOptions = {
    kind: 'insecure',
    ...clientOptionsParams
  }
  return insecureClientOptions
}

type CreateInsecureClientParams = {
  clientOptions: InsecureClientOptions
  operation: ServiceOperation
}

/* istanbul ignore next */
export const createInsecureClient = ({
  clientOptions,
  operation
}: CreateInsecureClientParams): InsecureClient => {
  switch (operation.controllerType) {
    case 'http': {
      switch (operation.serviceType) {
        case 'session': {
          switch (operation.path) {
            case '/web/webclient/version_info': {
              const data = JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {}
              })
              return {
                kind: 'insecure',
                client: fetch(
                  `http://${clientOptions.host}:${clientOptions.port}${operation.path}`,
                  {
                    method: 'POST',
                    body: data,
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      'Content-Length': data.length.toString()
                    }
                  }
                )
              }
            }
            case '/web/session/authenticate': {
              const data = JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: operation.params
              })
              return {
                kind: 'insecure',
                client: fetch(
                  `http://${clientOptions.host}:${clientOptions.port}${operation.path}`,
                  {
                    method: 'POST',
                    body: data,
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      'Content-Length': data.length.toString()
                    }
                  }
                )
              }
            }
            case '/web/session/modules': {
              const data = JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {}
              })
              return {
                kind: 'insecure',
                client: fetch(
                  `http://${clientOptions.host}:${clientOptions.port}${operation.path}`,
                  {
                    method: 'POST',
                    body: data,
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      'Content-Length': data.length.toString(),
                      'X-Openerp-Session-Id': operation.sessionToken
                    }
                  }
                )
              }
            }
            case '/web/session/get_session_info': {
              const data = JSON.stringify({
                jsonrpc: '2.0',
                method: 'call',
                params: {}
              })
              return {
                kind: 'insecure',
                client: fetch(
                  `http://${clientOptions.host}:${clientOptions.port}${operation.path}`,
                  {
                    method: 'POST',
                    body: data,
                    headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      'Content-Length': data.length.toString(),
                      'X-Openerp-Session-Id': operation.sessionToken
                    }
                  }
                )
              }
            }
            default:
              const exhaustiveCheck: never = operation
              const neverClient: InsecureClient = {} as InsecureClient
              return neverClient
          }
        }
        case 'model': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: operation.params
          })
          return {
            kind: 'insecure',
            client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString(),
                'X-Openerp-Session-Id': operation.sessionToken
              }
            })
          }
        }
        default:
          const exhaustiveCheck: never = operation
          const neverClient: InsecureClient = {} as InsecureClient
          return neverClient
      }
    }
    case 'jsonrpc': {
      switch (operation.serviceType) {
        case 'common': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: operation.serviceArgs.service,
              method: operation.serviceArgs.method,
              args: Object.values(operation.serviceArgs.methodArgs)
            }
          })
          return {
            kind: 'insecure',
            client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        case 'db': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: operation.serviceArgs.service,
              method: operation.serviceArgs.method,
              args: operation.serviceArgs.methodArgs
            }
          })
          return {
            kind: 'insecure',
            client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        case 'object': {
          const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              service: operation.serviceArgs.service,
              method: operation.serviceArgs.method,
              args: Object.values(operation.serviceArgs.methodArgs)
            }
          })
          return {
            kind: 'insecure',
            client: fetch(`http://${clientOptions.host}:${clientOptions.port}${operation.path}`, {
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Content-Length': data.length.toString()
              }
            })
          }
        }
        /* istanbul ignore next */
        default:
          const exhaustiveCheck: never = operation
          const neverClient: InsecureClient = {} as InsecureClient
          return neverClient
      }
    }
  }
}
