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
