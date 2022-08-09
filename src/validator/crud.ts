import { fieldType, schema, schemaType } from '../dto/validator'
import Validator from './validator'

class CRUDvalidator extends Validator {
  constructor(
    crud: { base: schemaType, omit?: string[] },
    others?: { [k: string]: schema }
  ) {
    const id: fieldType = 'guid'
    const createdAt: fieldType = 'timestamp'
    const updatedAt: fieldType = 'timestamp'
    const isDeleted: fieldType = 'bool'

    const create: schemaType = {}
    const update: schemaType = {}

    Object.keys(crud.base).forEach(k => {
      create[k] = crud.base[k]

      if (!crud.omit?.includes(k)) {
        const op = crud.base[k][1]

        if (op) {
          const { required, ...rest } = op

          update[k] = [crud.base[k][0], rest]
        } else { update[k] = [crud.base[k][0]] }
      }
    })

    const updateOr = [...Object.keys(update)]

    const getOr = [
      ...updateOr,
      'createdAt',
      'updatedAt',
      'isDeleted',
      'id'
    ]

    const getOne: schemaType = {
      id: [id],
      createdAt: [createdAt],
      updatedAt: [updatedAt],
      isDeleted: [isDeleted],
      ...update
    }

    super({
      create: [create],
      getOne: [
        getOne,
        { or: getOr }
      ],
      getMany: [
        {
          fields: ['array', { items: [getOne] }],
          take: ['number', { positive: true, int: true }],
          skip: ['number', { positive: true, int: true }],
          order: ['string', { valid: getOr }],
          direction: ['string', { valid: ['ASC', 'DESC'] }],
          group: ['array', { items: ['string', { valid: getOr }] }]
        }
      ],
      update: [
        {
          id: [id, { required: true }],
          ...update
        },
        { or: updateOr }
      ],
      delete: [
        { id: [id, { required: true }] },
      ],
      ...(others ?? {})
    })
  }
}

export default CRUDvalidator
