export interface tokenBody {
    permissions: string[]
    id: string
}

export interface signProps extends tokenBody {
    expires?: number
}

export interface verifyProps extends tokenBody {
    error: boolean
}