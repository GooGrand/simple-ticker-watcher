/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('tickers', {
        id: 'id',
        ticker: {type: "string", notNull: true, unique: true},
    });
    pgm.createTable('prices', {
        id: 'id',
        ticker_id: {type: 'integer', references: '"tickers"', onDelete: 'cascade', notNull: true},
        price: {type: "string", notNull: true},
        date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
          },
    });
    pgm.createType("request_type", ['date', 'pair']);
    pgm.createTable('logs', {
        id: 'id',
        request: {type: 'request_type', notNull: true},
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
          },
    });
    pgm.createIndex('prices', 'ticker_id');
    pgm.sql(`INSERT INTO tickers(ticker) VALUES ('RUB'), ('EUR'), ('USD'), ('JPY');`)
    pgm.sql(`INSERT INTO prices(ticker_id, price) VALUES (1, '1.1'), (2, '0.1'), (3, '9.1'), (4, 27);`)
    pgm.sql(`INSERT INTO prices(ticker_id, price, date) VALUES (1, '1.2', '2023-08-19'), (2, '1.1', '2023-08-19'), (3, '7.1', '2023-08-19'), (4, 26, '2023-08-19');`)
    pgm.sql(`INSERT INTO prices(ticker_id, price, date) VALUES (1, '1.3', '2023-08-18'), (2, '1.2', '2023-08-18'), (3, '8.1', '2023-08-18'), (4, 24, '2023-08-18');`)
};

exports.down = pgm => {
    pgm.dropTable('prices');
    pgm.dropTable('tickers');
    pgm.dropTable('logs');
    pgm.dropType("request_type");
};
