import { service } from '../dto'
import { BaseError } from '../error'
import { Validator } from '../validator'

class Services {
  private readonly endpoints: service.endpointsType

  constructor(
    private readonly validator: Validator,
    endpoints: Array<service.endpointType>
  ) {
    const requestEndpoints: service.endpointsType = {}

    endpoints.forEach(record => {
      requestEndpoints[record.key] = async (req: { [k: string]: any }): Promise<service.response> => {
        const { token, ...body } = req

        if (record.scope) {

        }

        this.validator.validate(
          record.validatorKey ?? record.key,
          body
        )

        const data = await record.call(body)

        return { data }
      }
    })

    this.endpoints = requestEndpoints
  }

  async request<T>(key: string, req: T): Promise<service.response> {
    try {
      return await this.endpoints[key](req)
    } catch (e) {
      return e instanceof BaseError
        ? {
          error: {
            msg: e.message,
            code: e.statusCode
          }
        }
        : {
          error: {
            msg: 'Server error',
            code: 500
          }
        }
    }
  }
};

export default Services
