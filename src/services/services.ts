import { service } from '../dto'
import { BaseError } from '../error'
import { Validator } from '../validator'

class Services {
  constructor(private readonly validator: Validator) { }

  async gateway(props: service.gatewayProps): Promise<service.response> {
    try {
      const { token, ...body } = props[0].req

      if (props[0].scope) {

      }

      this.validator.validate(
        props[0].validatorKey ?? 'none',
        body
      )

      const data = await props[1](body)

      return { data }
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
