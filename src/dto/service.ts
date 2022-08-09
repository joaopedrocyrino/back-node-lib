export interface response {
    error?: {
        msg: string
        code: number
    }
    data?: any
}

export type request = { [k:string]: any }

export interface endpointType {
    key: string
    scope?: string[]
    validatorKey?: string
    call: (req: request) => Promise<any>
}

export type endpointsType = { [k: string]: (req: request) => Promise<response> }
