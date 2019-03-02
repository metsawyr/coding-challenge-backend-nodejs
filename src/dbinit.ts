import * as config from 'config';
import { createConnection } from 'mysql';

const connection = createConnection({
    host: config.get('database.host'),
    port: config.get('database.port'),
    user: config.get('database.user'),
    password: config.get('database.password'),
});

const database = config.get('database.name');

connection.query(`
    CREATE DATABASE \`${database}\`;
`);

connection.query(`
    USE \`${database}\`;
`);

connection.query(`
    CREATE TABLE \`districts\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(64) NOT NULL DEFAULT '',
        PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB CHARSET=utf8;
`);

connection.query(`
    INSERT INTO \`districts\` (\`id\`, \`name\`)
    VALUES
        (1,'Mitte'),
        (2,'Friedrichshain-Kreuzberg'),
        (3,'Pankow'),
        (4,'Charlottenburg-Wilmersdorf'),
        (5,'Spandau'),
        (6,'Steglitz-Zehlendorf'),
        (7,'Tempelhof-Schöneberg'),
        (8,'Neukölln'),
        (9,'Treptow-Köpenick'),
        (10,'Marzahn-Hellersdorf'),
        (11,'Lichtenberg'),
        (12,'Reinickendorf');
`);

connection.query(`
    CREATE TABLE \`departments\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL DEFAULT '',
        \`district\` int(11) unsigned NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`district\` (\`district\`),
        CONSTRAINT \`district\` FOREIGN KEY (\`district\`) REFERENCES \`districts\` (\`id\`)
    ) ENGINE=InnoDB CHARSET=utf8;
`);

connection.query(`
    INSERT INTO \`departments\` (\`id\`, \`name\`, \`district\`)
    VALUES
        (1,'Mitte Stealing Department',1),
        (2,'Steglitz-Zehlendorf Traffic Department',6);
`);

connection.query(`
    CREATE TABLE \`officers\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL DEFAULT '',
        \`department\` int(11) unsigned NOT NULL,
        \`cases_closed\` int(16) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`department\` (\`department\`),
        CONSTRAINT \`department\` FOREIGN KEY (\`department\`)
        REFERENCES \`departments\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB CHARSET=utf8;
`);

connection.query(`
    INSERT INTO \`officers\` (\`id\`, \`name\`, \`department\`, \`cases_closed\`)
    VALUES
        (1,'Emma Fischer',1,5),
        (2,'Sebastian Schmidt ',2,2),
        (3,'Sofia Rothschild ',2,7),
        (5,'Hans Lachs',1,6);
`);

connection.query(`
    CREATE TABLE \`steal_cases\` (
        \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
        \`owner_name\` varchar(255) NOT NULL DEFAULT '',
        \`license_number\` varchar(32) NOT NULL DEFAULT '',
        \`color\` varchar(32) NOT NULL DEFAULT '',
        \`type\` varchar(16) NOT NULL DEFAULT '',
        \`district\` int(11) unsigned DEFAULT NULL,
        \`steal_details\` text,
        \`officer\` int(11) unsigned DEFAULT NULL,
        \`date_created\` datetime NOT NULL,
        \`date_closed\` datetime DEFAULT NULL,
        \`status\` varchar(16) NOT NULL DEFAULT '',
        \`resolution_report\` text,
        PRIMARY KEY (\`id\`),
        KEY \`steal_district\` (\`district\`),
        KEY \`steal_officer\` (\`officer\`),
        CONSTRAINT \`steal_district\` FOREIGN KEY (\`district\`) REFERENCES \`districts\` (\`id\`),
        CONSTRAINT \`steal_officer\` FOREIGN KEY (\`officer\`) REFERENCES \`officers\` (\`id\`)
    ) ENGINE=InnoDB CHARSET=utf8;
`);

connection.end();
