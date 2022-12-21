"use strict";
const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: "Blog CRUD Help Page",
        version: "0.0.1",
        description: "This is a basic user API it allows you create, retrieve update and delete users from an in memmory array written in node / express"
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "local env"
        },
        {
            url: "http://production",
            description: "local env"
        }
    ],
    tags: [
        {
            name: "User",
            description: "User routes"
        }
    ],
    paths: {
        "/users": {
            get: {
                tags: [
                    "User"
                ]
            }
        }
    }
};
module.exports = swaggerDocumentation;
