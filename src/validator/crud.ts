import { fieldType, schema, schemaType } from '../dto/validator'
import Validator from './validator'

class CRUDvalidator extends Validator {
  constructor(
    crud: [schemaType, string[]] | [schemaType],
    others?: { [k: string]: schema }
  ) {
    const id: fieldType = 'guid'
    const createdAt: fieldType = 'timestamp'
    const updatedAt: fieldType = 'timestamp'
    const isDeleted: fieldType = 'bool'

    const create: schemaType = {}
    const update: schemaType = {}

    Object.keys(crud[0]).forEach(k => {
      create[k] = crud[0][k]

      if (!crud[1]?.includes(k)) {
        const op = crud[0][k][1]

        if (op) {
          const { required, ...rest } = op

          update[k] = [crud[0][k][0], rest]
        } else { update[k] = [crud[0][k][0]] }
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
