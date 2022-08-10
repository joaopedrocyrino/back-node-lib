import moment from 'moment'

import { Uuid } from '../uuid'
import { baseDTO } from '../dto/crud'

export const createBase = (): baseDTO => {
    const timestamptz = moment().toISOString()

    return {
        id: new Uuid().generate(),
        createdAt: timestamptz,
        updatedAt: timestamptz,
        isDeleted: false
    }
}

export const handleSnakeCase = (entity: { [k: string]: any }, snakeCases: Array<[string, string]>) => {
    snakeCases.forEach(sc => {
        if (entity[sc[0]]) {
            entity[sc[1]] = entity[sc[0]]
        }
    })
    return entity
}
