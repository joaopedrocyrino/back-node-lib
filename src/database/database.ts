import 'dotenv/config'
import { Pool } from 'pg'

class Database {
    private readonly pools: { [k: string]: Pool } = {}

    constructor(databaseConnectionStrings?: { [k: string]: string }) {
        const connections = {
            default: process.env.DATABASE_STRING ?? '',
            ...(databaseConnectionStrings ?? {})
        }

        Object.keys(connections).forEach((k) => {
            this.pools[k] = new Pool({
                connectionString: connections[k as keyof typeof connections]
            })
        })
    }

    async query<T>(queryString: string, pool?: string): Promise<T[]> {
        const poolKey = pool ?? 'default'

        const client = await this.pools[poolKey].connect()

        console.log(`\nQUERY: ${queryString}\n`)

        const res: { rows: T[] } = await client.query(queryString)

        client.release()

        return res.rows
    }
}

export default Database
