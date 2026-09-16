const queueModel = require("../models/queue.model");

function addCustomer(name) {
    const customer = {
        name,
        createdAt: new Date().toISOString(),
        status: "Waiting"
    };

    return queueModel.createCustomer(customer);
}

function getWaitingCustomers() {
    return queueModel.findWaitingCustomers();
}

function getCustomerById(id) {
    return queueModel.findCustomerById(id);
}

function getCustomerPosition(id) {
    const customer = queueModel.findCustomerById(id);

    if (!customer) {
        return null;
    }

    if (customer.status !== "Waiting") {
        return null;
    }

    const waitingCustomers = queueModel.findWaitingCustomers();

    const index = waitingCustomers.findIndex(
        (waitingCustomer) => waitingCustomer.id === customer.id
    );

    return index === -1 ? null : index + 1;
}

function removeCustomer(id) {
    return queueModel.deleteCustomer(id);
}

function callNextCustomer() {
    return queueModel.callNextCustomer();
}

module.exports = {
    addCustomer,
    getWaitingCustomers,
    getCustomerById,
    getCustomerPosition,
    removeCustomer,
    callNextCustomer
};