const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
dotenv.config();

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Library Management API",
        version: "1.0.0",
        description: "API documentation for the Library Management application",
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 5500}/api/v1`,
            description: "Development server",
        },
    ],
};

const options = {
    swaggerDefinition,
    // Path to the API specs
    apis: ["./routes/*.js", "./controller/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = swaggerUi.serve;
const swaggerUiSetup = swaggerUi.setup(swaggerSpec);

module.exports = {
    swaggerDocs,
    swaggerUiSetup,
};
