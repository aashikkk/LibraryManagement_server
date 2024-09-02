const express = require("express");
const connectDB = require("./connection/db");
const morgan = require("morgan");
const cors = require("cors");
const apiRoutes = require("./routes");
const { swaggerDocs, swaggerUiSetup } = require("./swagger");

require("dotenv").config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,DELETE,PUT",
        credentials: true,
    })
);

app.use(morgan("dev"));
app.use("/api-docs", swaggerDocs, swaggerUiSetup);

// Routes
app.use("/api/v1/", apiRoutes);
app.use("*", (req, res) => {
    return res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        message: "Something went wrong",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
