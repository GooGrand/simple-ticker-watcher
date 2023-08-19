/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('tickers', {
        id: 'id',
        ticker: {type: "string", notNull: true, unique: true},
    });
    pgm.createTable('prices', {
        id: 'id',
        tickerId: {type: 'integer', references: '"tickers"', onDelete: 'cascade', notNull: true},
        price: {type: "string", notNull: true},
        updatedAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
          },
    });
    pgm.createIndex('prices', 'tickerId');
    pgm.sql(`INSERT INTO tickers(ticker) VALUES ('RUB'), ('EUR'), ('USD'), ('JPY');`)
};

exports.down = pgm => {
    pgm.dropTable('prices');
    pgm.dropTable('tickers');
};
