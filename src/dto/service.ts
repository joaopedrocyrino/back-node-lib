export interface response {
    error?: {
        msg: string
        code: number
    }
    data?: any
}

export type request = { [k: string]: any }

export type gatewayProps = [
    {
        req: request
        scope?: string[]
        validatorKey?: string
    },
    (body: request) => Promise<any>
]

export type access = string[]

export interface crudAccess {
    c?: access
    r?: access
    u?: access
    d?: access
}
