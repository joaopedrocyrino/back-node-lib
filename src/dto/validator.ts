export type fieldType = 'string' | 'guid' | 'bool' | 'number' | 'timestamp' | 'custom' | 'array'

export interface fieldOpts {
    required?: boolean
    items?: schema | field
    positive?: boolean
    negative?: boolean
    max?: number
    min?: number
    length?: number
    int?: boolean
    valid?: any[]
    custom?: (value: any) => boolean
}

export type field = [fieldType, fieldOpts] | [fieldType]

export interface schemaOpts {
    or?: string[]
}

export type schemaType = { [k: string]: field }

export type schema = [schemaType, schemaOpts] | [schemaType]
