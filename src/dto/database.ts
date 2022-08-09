export interface baseFields {
    created_at: string
    updated_at: string
    is_deleted: boolean
}

export interface getMany<T> {
    fields?: Array<Partial<T>>
    take?: number
    skip?: number
    order?: keyof T
    direction?: 'ASC' | 'DESC'
    group?: Array<keyof T>
}