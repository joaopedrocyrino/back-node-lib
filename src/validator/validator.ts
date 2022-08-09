import Joi from 'joi'

import { BaseError } from '../error'
import { field, schema } from '../dto/validator'

class Validator {
    private readonly joiObjects: { [k: string]: Joi.ObjectSchema }

    constructor(private readonly schemas: { [k: string]: schema }) {
        const joiObjects = this.transformSchemas(schemas)
        this.joiObjects = joiObjects
    }

    private transformSchemas(schemas: { [k: string]: schema }): { [k: string]: Joi.ObjectSchema } {
        const joiObjects: { [k: string]: Joi.ObjectSchema } = {}

        Object.keys(this.schemas).forEach((k) => {
            const schema = schemas[k]
            const fields = schema[0]
            const schemaOpts = schema[1]

            const joiObj: { [k: string]: Joi.AnySchema } = {}

            Object.keys(fields).forEach(field => {
                joiObj[field] = this.fieldToJoi(fields[field])
            })

            joiObjects[k] = Joi.object(joiObj)

            if (schemaOpts?.or) {
                joiObjects[k] = joiObjects[k].or(...schemaOpts.or)
            }
        })

        return joiObjects
    }

    private fieldToJoi(f: field): Joi.Schema {
        let fieldSchema
        const opts = f[1]

        switch (f[0]) {
            case 'string':
                fieldSchema = Joi.string()

                if (opts?.length) {
                    fieldSchema = fieldSchema.length(opts.length)
                } else {
                    if (opts?.max) { fieldSchema = fieldSchema.max(opts.max) }

                    if (opts?.min) { fieldSchema = fieldSchema.min(opts.min) }
                }

                break

            case 'guid':
                fieldSchema = Joi.string().guid()

                break

            case 'bool':
                fieldSchema = Joi.boolean()

                break

            case 'number':
                fieldSchema = Joi.number()

                if (opts?.int) { fieldSchema = fieldSchema.integer() }
                if (opts?.max) { fieldSchema = fieldSchema.max(opts.max) }
                if (opts?.min) { fieldSchema = fieldSchema.min(opts.min) }
                if (opts?.positive) { fieldSchema = fieldSchema.positive() }
                else if (opts?.negative) { fieldSchema = fieldSchema.negative() }

                break

            case 'timestamp':
                fieldSchema = Joi.date().iso()

                break

            case 'array':
                const items = opts?.items

                let item: Joi.Schema

                if(items && typeof items[0] === 'string') {
                    item = this.fieldToJoi(items as field)
                } else {
                    const { i } = this.transformSchemas({ i: items as schema ?? [{}] })

                    item = i
                }

                fieldSchema = Joi.array().items(item)
                break

            default:
                fieldSchema = Joi.custom((value, helper) => {
                    const custom = opts
                        ? opts.custom
                        : undefined

                    const isValid = custom
                        ? custom(value)
                        : false

                    if (isValid) {
                        return true
                    } else { return helper.error(`invalid custom value: ${value}`) }
                })
        }

        if (opts?.valid) {
            fieldSchema.valid(...opts.valid)
        }

        if (opts?.required) {
            fieldSchema.required()
        }

        return fieldSchema
    }

    validate(schemaKey: string, body: { [k: string]: any }): void {
        const joiObj = this.joiObjects[schemaKey]

        if (joiObj) {
            const { error } = joiObj.validate(body)
            if (error) { throw new BaseError(400, `Validation error: ${error}`) }
        }
    }
}

export default Validator
