const OK = 0;
const ERROR_NO_SUCH_BATTERY = -1;
const ERROR_OUT_OF_STOCK = -2;

const mariadb = require('mariadb');

// Create a connection pool (recommended)
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '251286',
    database: process.env.DB_NAME || 'batterydb',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5
});

exports.initialise = function () {

}

exports.getBatteryList = async function (marka) {
    let conn;
    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT * FROM battery WHERE marka = ?`,
            [marka]
        );

        return rows; // Returns an array of records
    } catch (err) {
        console.error('Error fetching battery list:', err);
        return null; // Or throw err if you prefer to handle upstream
    } finally {
        if (conn) conn.release();
    }
};

exports.buyBattery = async function (anID) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Decrement only if available > 0
        const result = await conn.query(
            `UPDATE battery
             SET available = available - 1
             WHERE id = ? AND available > 0`,
            [anID]
        );

        // result.affectedRows will be 1 if successful, 0 if no rows were updated
        if (result.affectedRows === 0) {
            return ERROR_OUT_OF_STOCK;
        }

        return OK;
    } catch (err) {
        console.error('Error buying battery:', err);
        return ERROR_OUT_OF_STOCK;
    } finally {
        if (conn) conn.release();
    }
};

exports.addBatteryType = async function (brand, price, available, length, width, height, ampere, amp, image) {
    let conn;
    try {
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT id FROM battery
             WHERE marka = ? AND amper = ? AND amp = ?
               AND length = ? AND width = ? AND height = ?`,
            [brand, ampere, amp, length, width, height]
        );

        if (rows.length > 0) {
            await conn.query(
                `UPDATE battery
                 SET available = available + ?, price = ?, image = ?
                 WHERE id = ?`,
                [available, price, image, rows[0].id]
            );
        } else {
            await conn.query(
                `INSERT INTO battery
                (marka, price, available, length, width, height, amper, amp, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [brand, price, available, length, width, height, ampere, amp, image]
            );
        }

        return OK;
    } catch (err) {
        console.error('Error adding battery type:', err);
        return err;
    } finally {
        if (conn) conn.release();
    }
};