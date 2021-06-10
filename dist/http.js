"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var operations_1 = require("./routes/operations");
exports.default = (function (config) {
    if (config === void 0) { config = {
        resources: ["Patient"]
    }; }
    var http = fastify_1.default();
    // Whole System Interactions
    // Get a capability statement for the system
    http.route({
        method: 'GET',
        url: '/metadata',
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    mode: {
                        type: 'string',
                        enum: ['full', 'normative', 'terminology'],
                        default: 'full'
                    }
                }
            },
        },
        handler: operations_1.capabilities
    });
    // Update, create or delete a set of resources in a single interaction
    http.route({
        method: 'POST',
        url: '/',
        handler: operations_1.batch
    });
    // Instance Level Interactions
    config.resources.forEach(function (resource) {
        // Read the current state of the resource
        http.route({
            method: 'GET',
            url: "/" + resource + "/:id",
            handler: operations_1.read
        });
        // Read the state of a specific version of the resource
        http.route({
            method: 'GET',
            url: "/" + resource + "/:id/_history/:vid",
            handler: operations_1.vread
        });
        // Update an existing resource by its id (or create it if it is new)
        http.route({
            method: 'PUT',
            url: "/" + resource + "/:id",
            handler: operations_1.update
        });
        // Update an existing resource by posting a set of changes to it
        http.route({
            method: 'PATCH',
            url: "/" + resource + "/:id",
            handler: operations_1.patch
        });
        // Delete a resource
        http.route({
            method: 'DELETE',
            url: "/" + resource + "/:id",
            handler: operations_1.destroy
        });
        // 	Retrieve the change history for a particular resource
        http.route({
            method: 'GET',
            url: "/" + resource + "/:id/_history",
            handler: operations_1.history
        });
    });
    // Type Level Interactions
    config.resources.forEach(function (resource) {
        // Create a new resource with a server assigned id
        http.route({
            method: 'POST',
            url: "/" + resource,
            handler: operations_1.create
        });
        // Search the resource type based on some filter criteria
        http.route({
            method: 'GET',
            url: "/" + resource + "/_search",
            handler: operations_1.search
        });
        // Support for POST-based search
        http.route({
            method: 'POST',
            url: "/" + resource + "/_search",
            handler: operations_1.search
        });
        // Retrieve the change history for a particular resource type
        http.route({
            method: 'GET',
            url: "/" + resource + "/_history",
            handler: operations_1.history
        });
    });
    http.listen(8080, function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log("Server listening at " + address);
    });
    return http;
});
