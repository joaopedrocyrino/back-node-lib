import { getMany } from './database'

export interface createDTO {
    token: string
}

export interface deleteDTO {
    id: string
    token: string
}

export interface updateDTO {
    id: string
    token: string
}

export interface getOneDTO {
    id?: string
    token: string
}

export interface getManyDTO<T> extends getMany<T>{
    token: string
}

export interface baseDTO {
    id: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
}
