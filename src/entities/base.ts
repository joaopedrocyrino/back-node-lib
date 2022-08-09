import { baseFields } from '../dto/database'

class Base {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean

  constructor({
    created_at,
    updated_at,
    is_deleted,
    id,
    createdAt,
    updatedAt,
    isDeleted
  }: Partial<Base> & Partial<baseFields>) {

    this.id = id ?? ''
    this.createdAt = createdAt ?? ''
    this.updatedAt = updatedAt ?? ''
    this.isDeleted = isDeleted ?? false

    if (created_at) { this.createdAt = created_at }
    if (updated_at) { this.updatedAt = updated_at }
    if (is_deleted) { this.isDeleted = is_deleted }
  }
}

export default Base
