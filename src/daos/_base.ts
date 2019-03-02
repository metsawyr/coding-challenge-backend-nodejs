import { Connection, FieldInfo } from 'mysql';
import { Dictionary, Omit } from '../core/structure';
import { splitObject, toLowerFirst, toUpperFirst } from '../core/utils';
import { Scheme } from '../schemes/_base';

interface UpdateCodes<T> {
    $inc: {
        [P in keyof T]?: number
    };
}

export type UpdateQuery<T> = Partial<T> & Partial<UpdateCodes<T>>;

export abstract class Dao<T extends Scheme> {
    public abstract tableName: string;
    private $connection: Connection;

    constructor(private conn: Promise<Connection>) {}

    protected async create(obj: Partial<T>) {
        const { keys, values } = splitObject(this.transformIncoming(obj));

        const { results } = await this.query(
            `INSERT INTO ${this.tableName}(${keys.join(',')}) ` +
            `VALUES (${values.map(
                (item) => typeof item === 'string' ? `'${item}'` : item
            )})`
        );

        return results;
    }

    protected async get(obj: Partial<T>): Promise<Array<T>> {
        const where = this.transformObjectToPairs(
            this.transformIncoming(obj)
        );

        const { results } = await this.query(
            `SELECT * FROM ${this.tableName}`
            + (where.length ? ` WHERE ${where.join(' AND ')}` : '')
        );

        return results;
    }

    protected async update(obj: Partial<T>, substitution: UpdateQuery<Omit<T, 'id'>>) {
        const set = this.transformObjectToPairs(
            this.transformIncoming(substitution)
        );
        const where = this.transformObjectToPairs(
            this.transformIncoming(obj)
        );

        const { results } = await this.query(
            `UPDATE ${this.tableName} `
            + `SET ` + set.join(', ')
            + (where.length ? ` WHERE ${where.join(' AND ')}` : '')
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
                            results: Array.isArray(results) ? results.map(this.transformOutcoming) : results,
                            fields,
                        });
                    }
            );
        });
    }

    protected transformObjectToPairs(target: Dictionary): Array<string> {
        return Object.entries(target)
            .reduce(
                (result, [key, value]) => {
                    if (key === '$inc') {
                        result.push(
                            ...Object.entries(value).map(
                                ([incKey, incValue]) => `${incKey} = ${incKey} + ${incValue}`
                            )
                        );
                    }
                    else {
                        result.push(
                            `${key} = ` + (typeof value === 'string' ? `'${value}'` : value)
                        );
                    }

                    return result;
                },
                []
            );
    }

    protected transformIncoming(target: Dictionary): Dictionary {
        return Object.entries(target).reduce(
            (result, [key, value]) => {
                if (key.charAt(0) === '$') {
                    Object.assign(result, this.transformIncoming(value));
                }
                else {
                    const transformed = key.split(/(?=[A-Z])/).map(toLowerFirst).join('_');
                    result[transformed] = value;
                }
                return result;
            },
            {} as Dictionary
        );
    }

    protected transformOutcoming(target: Dictionary): Dictionary {
        return Object.entries(target).reduce(
            (result, [key, value]) => {
                const transformed = toLowerFirst(
                    key.split('_').map(toUpperFirst).join('')
                );
                result[transformed as keyof T] = value;
                return result;
            },
            {} as Partial<T>
        );
    }
}
