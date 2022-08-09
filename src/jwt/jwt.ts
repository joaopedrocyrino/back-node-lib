import 'dotenv/config'
import jwt from 'jsonwebtoken'

import { tokenBody, signProps, verifyProps } from '../dto/jwt'

class Jwt {
    sign({ id, permissions, expires }: signProps): string {
        const token = jwt.sign(
            { id, permissions },
            process.env.JWT_SECRET ?? '',
            { expiresIn: `${expires || 12}h` }
        )

        return token
    }

    async verify(token: string): Promise<verifyProps> {
        let permissions: string[] = []
        let id: string = ''
        let error: boolean = false

        await new Promise<void>((resolve) => {
            jwt.verify(token, process.env.JWT_SECRET ?? '',
                (err, decoded) => {
                    if (err) { error = true } else {
                        const { permissions: p, id: ID } = decoded as tokenBody
                        permissions = p
                        id = ID
                    }
                    resolve()
                })
        })

        return { permissions, error, id }
    }

    decode(token: string): tokenBody {
        const decode = jwt.decode(token)

        return decode as tokenBody
    }
}

export default new Jwt()
