import { createBase } from '../entities/utils'
import { CRUDvalidator } from '../validator'
import { CRUDquery } from '../database'
import Services from './services'
import { service } from '../dto'

class CRUDservices extends Services {
  constructor(
    private readonly query: CRUDquery,
    protected readonly fullAccess: string[],
    validator: CRUDvalidator,
    crudAccess: {
      c?: string[]
      r?: string[]
      u?: string[]
      d?: string[]
    }
  ) {
    super(
      validator,
      [
        {
          key: 'create',
          scope: [...crudAccess.c ?? [], ...fullAccess],
          call: async (req: service.request) => {
            const base = createBase()

            await this.query.create({ ...base, ...req })
        
            return base.id
          }
        },
        {
          key: 'getOne',
          scope: [...crudAccess.r ?? [], ...fullAccess, 'self'],
          call: async (req: service.request) => {
            const record = await this.query.getOne(req)

            return record
          }
        },
        {
          key: 'getMany',
          scope: [...crudAccess.r ?? [], ...fullAccess],
          call: async (req: service.request) => {
            const records = await this.query.getMany(req)

            return records
          }
        },
        {
          key: 'update',
          scope: [...crudAccess.u ?? [], ...fullAccess],
          call: async (req: service.request) => {
            const { id, ...fields } = req

            await this.query.update(id, fields)
        
            return id
          }
        },
        {
          key: 'delete',
          scope: [...crudAccess.d ?? [], ...fullAccess],
          call: async (req: service.request) => {
            await this.query.delete(req.id)

            return req.id
          }
        }
      ]
    )
  }
};

export default CRUDservices
