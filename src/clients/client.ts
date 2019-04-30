import { SecureClient, SecureClientOptions, createSecureClient } from './secureClient'
import { InsecureClient, InsecureClientOptions, createInsecureClient } from './insecureClient'
import { ServiceOperation } from '../controllers/controller'

type Client = SecureClient | InsecureClient

export interface BaseClient {
  client: Promise<Response>
}

export interface BaseClientOptions {
  host: string
}

export type ClientOptions = SecureClientOptions | InsecureClientOptions

type CreateClientParams = {
  clientOptions: ClientOptions
  operation: ServiceOperation
}

/* istanbul ignore next */
export const createClient = ({ clientOptions, operation }: CreateClientParams): Client => {
  switch (clientOptions.kind) {
    case 'insecure': {
      return createInsecureClient({
        clientOptions,
        operation
      })
    }
    case 'secure': {
      return createSecureClient({
        clientOptions,
        operation
      })
    }
    /* istanbul ignore next */
    default:
      const exhaustiveCheck: never = clientOptions
      const neverClient: Client = {} as Client
      return neverClient
  }
}

export { createInsecureClientOptions } from './insecureClient'
export { createSecureClientOptions } from './secureClient'
