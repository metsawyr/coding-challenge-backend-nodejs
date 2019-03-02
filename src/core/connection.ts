import * as config from 'config';
import { Connection, createConnection } from 'mysql';
import * as winston from 'winston';

const host = config.get('database.host') as string;
const port = config.get('database.port') as number;
const user = config.get('database.user') as string;
const password = config.get('database.password') as string;
const database = config.get('database.name') as string;

export const connection = new Promise<Connection>((resolve, reject) => {
    const conn = createConnection({
        host,
        user,
        port,
        password,
        database,
    });

    conn.connect((err) => {
        if (err) {
            winston.error('DATABASE_CONNECTION_ERROR', err);
            return reject(err);
        }

        resolve(conn);
    });
});
