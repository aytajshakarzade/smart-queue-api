const express = require("express");
const queueController = require("../controllers/queue.controller");

const router = express.Router();

router.post("/", queueController.addCustomer);
router.get("/", queueController.getQueue);
router.post("/next", queueController.callNextCustomer);
router.get("/:id", queueController.getCustomer);
router.delete("/:id", queueController.deleteCustomer);

module.exports = router;