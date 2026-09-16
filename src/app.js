const express = require("express");
const queueRoutes = require("./routes/queue.routes");

const app = express();

app.use(express.json());

app.use("/api/queue", queueRoutes);

app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found"
    });
});

module.exports = app;