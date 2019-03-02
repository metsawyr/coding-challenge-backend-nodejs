import { Connection, FieldInfo } from 'mysql';
import { splitObject } from '../core/utils';

export abstract class Dao<T> {
    protected abstract tableName: string;
    private $connection: Connection;

    constructor(private conn: Promise<Connection>) {}

    protected async create(obj: Partial<T>) {
        const { keys, values } = splitObject(obj);

        return this.query(
            `INSERT INTO ${this.tableName}(${keys.join(',')}) ` +
            `VALUES (${values.map(
                (item) => typeof item === 'string' ? `'${item}'` : item
            )})`
            
        );
    }

    protected async list(obj: Partial<T>): Promise<Array<T>> {
        const where = Object.entries(obj)
            .map(
                ([key, value]) => `${key} = ` + typeof value === 'string' ? `${value}'` : value
            );

        const { results } = await this.query(
            `SELECT * FROM ${this.tableName}`
            + where.length ? `WHERE ${where.join(' AND ')}` : ''
        );

        return results;
    }

    protected async query(query: string) {
        if (!this.$connection) {
            this.$connection = await this.conn;
        }

        return new Promise<{ results: any, fields: Array<FieldInfo> }>(
            (resolve, reject) => {
                this.$connection.query(
                    query,
                    (error, results, fields) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve({
                            results,
                            fields,
                        });
                    }
            );
        });
    }
}
