const db = require("../config/database");

function createCustomer({ name, createdAt, status }) {
    const statement = db.prepare(`
        INSERT INTO customers (name, created_at, status)
        VALUES (?, ?, ?)
    `);

    const result = statement.run(name, createdAt, status);

    return findCustomerById(result.lastInsertRowid);
}

function findCustomerById(id) {
    return db.prepare(`
        SELECT
            id,
            name,
            created_at AS createdAt,
            status
        FROM customers
        WHERE id = ?
    `).get(id);
}

function findWaitingCustomers() {
    return db.prepare(`
        SELECT
            id,
            name,
            created_at AS createdAt,
            status
        FROM customers
        WHERE status = 'Waiting'
        ORDER BY created_at ASC, id ASC
    `).all();
}

function deleteCustomer(id) {
    return db.prepare(`
        DELETE FROM customers
        WHERE id = ?
    `).run(id);
}

function callNextCustomer() {
    const transaction = db.transaction(() => {
        const customer = db.prepare(`
            SELECT
                id,
                name,
                created_at AS createdAt,
                status
            FROM customers
            WHERE status = 'Waiting'
            ORDER BY created_at ASC, id ASC
            LIMIT 1
        `).get();

        if (!customer) {
            return null;
        }

        db.prepare(`
            UPDATE customers
            SET status = 'Serving'
            WHERE id = ?
        `).run(customer.id);

        return findCustomerById(customer.id);
    });

    return transaction();
}

module.exports = {
    createCustomer,
    findCustomerById,
    findWaitingCustomers,
    deleteCustomer,
    callNextCustomer
};