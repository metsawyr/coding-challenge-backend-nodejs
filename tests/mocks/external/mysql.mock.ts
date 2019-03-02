import * as mysql from 'mysql';

export const connectionPrototype = {
    connect: jest.fn(
        (cb: Function) => {
            cb();
        }
    ),
    query: jest.fn(
        (
            query: string,
            cb: (error: any, results: any, fields: Array<mysql.FieldInfo>) => void
        ) => {
            cb(undefined, [], []);
        }
    )
};

(mysql as any).createConnection = jest.fn(
    () => {
        return Object.create(connectionPrototype);
    }
);
