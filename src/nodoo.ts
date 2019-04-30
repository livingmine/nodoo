import { Either, left, right } from 'fp-ts/lib/Either'
import 'cross-fetch/polyfill'
import xs, { Stream } from 'xstream'
import 'core-js/fn/object/values'
import { ServiceOperation, ServiceOperationResult } from './controllers/controller'
import {
  ServiceOperationError,
  createServiceOperationError,
  addExceptionTypeToOdooJSONRPCError
} from './error'
import { ClientOptions, createClient } from './clients/client'

type CreateServiceParams = {
  operation: ServiceOperation
  clientOptions: ClientOptions
}

export const createService = ({
  operation,
  clientOptions
}: CreateServiceParams): Stream<Either<ServiceOperationError, ServiceOperationResult>> => {
  const client = createClient({ clientOptions, operation })
  return xs
    .fromPromise(client.client)
    .map(result => {
      return xs.fromPromise(result.json())
    })
    .flatten()
    .map(result => {
      /* istanbul ignore next */
      if (result.result) {
        return right(result.result) as Either<ServiceOperationError, ServiceOperationResult>
      } else if (result.error) {
        return left(
          createServiceOperationError({
            error: addExceptionTypeToOdooJSONRPCError(result.error)
          })
        ) as Either<ServiceOperationError, ServiceOperationResult>
      }
      return right(result.result) as Either<ServiceOperationError, ServiceOperationResult>
    })
    .map(result => {
      return result
    })
}

export {
  jsonController,
  httpController,
  ServiceOperation,
  ServiceOperationResult
} from './controllers/controller'
export { createInsecureClientOptions, createSecureClientOptions } from './clients/client'

export { ServiceOperationError } from './error'
export { createClient } from './clients/client'
