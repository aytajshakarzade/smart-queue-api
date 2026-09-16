const queueService = require("../services/queue.service");

function addCustomer(req, res) {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    const customer = queueService.addCustomer(name.trim());

    return res.status(201).json(customer);
}

function getQueue(req, res) {
    const customers = queueService.getWaitingCustomers();

    return res.status(200).json(customers);
}

function getCustomer(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid customer id"
        });
    }

    const customer = queueService.getCustomerById(id);

    if (!customer) {
        return res.status(404).json({
            message: "Customer not found"
        });
    }

    const position = queueService.getCustomerPosition(id);

    return res.status(200).json({
        ...customer,
        position
    });
}

function callNextCustomer(req, res) {
    const customer = queueService.callNextCustomer();

    if (!customer) {
        return res.status(404).json({
            message: "No waiting customers"
        });
    }

    return res.status(200).json(customer);
}

function deleteCustomer(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid customer id"
        });
    }

    const customer = queueService.getCustomerById(id);

    if (!customer) {
        return res.status(404).json({
            message: "Customer not found"
        });
    }

    queueService.removeCustomer(id);

    return res.status(204).send();
}

module.exports = {
    addCustomer,
    getQueue,
    getCustomer,
    callNextCustomer,
    deleteCustomer
};