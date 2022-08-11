import { CRUDvalidator } from '../validator'
import { CRUDquery } from '../database'
import { utils } from '../entities'
import Services from './services'
import { service } from '../dto'

class CRUDservices extends Services {
  private readonly access: service.crudAccess

  constructor(
    private readonly entity: any,
    private readonly query: CRUDquery,
    validator: CRUDvalidator,
    fullAccess: service.access,
    crudAccess: service.crudAccess
  ) {
    super(validator)

    this.access = {
      c: [...fullAccess, ...crudAccess.c ?? []],
      r: [...fullAccess, ...crudAccess.r ?? []],
      u: [...fullAccess, ...crudAccess.u ?? []],
      d: [...fullAccess, ...crudAccess.d ?? []],
    }
  }

  async create(req: service.request): Promise<service.response> {
    return await this.gateway([
      {
        req,
        scope: this.access.c,
        validatorKey: 'create'
      },
      async (body: service.request): Promise<string> => {
        const base = utils.createBase()

        await this.query.create({ ...base, ...body })

        return base.id
      }
    ])
  }

  async getOne(req: service.request): Promise<service.response> {
    return await this.gateway([
      {
        req,
        scope: this.access.r,
        validatorKey: 'getOne'
      },
      async (body: service.request): Promise<any> => {
        const record = await this.query.getOne(body)

        return new this.entity(record)
      }
    ])
  }

  async getMany(req: service.request): Promise<service.response> {
    return await this.gateway([
      {
        req,
        scope: this.access.r,
        validatorKey: 'getMany'
      },
      async (body: service.request): Promise<any[]> => {
        const records = await this.query.getMany(body)

        return records.map(r => new this.entity(r))
      }
    ])
  }

  async update(req: service.request): Promise<service.response> {
    return await this.gateway([
      {
        req,
        scope: this.access.u,
        validatorKey: 'update'
      },
      async (body: service.request): Promise<string> => {
        const { id, ...fields } = body

        await this.query.update(id, fields)

        return id
      }
    ])
  }

  async delete(req: service.request): Promise<service.response> {
    return await this.gateway([
      {
        req,
        scope: this.access.d,
        validatorKey: 'delete'
      },
      async (body: service.request): Promise<string> => {
        await this.query.delete(body.id)

        return body.id
      }
    ])
  }
};

export default CRUDservices
