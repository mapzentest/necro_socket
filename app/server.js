"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const indexRoute = require("./routes/index");
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    static bootstrap() {
        return new Server();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "www")));
        this.app.use(express.static(path.join(__dirname, "../bower_components")));
        console.log(path.join(__dirname, "../bower_components"));
        this.app.use(function (err, req, res, next) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }
    routes() {
        let router;
        router = express.Router();
        var index = new indexRoute.Index();
        router.get("/", index.index.bind(index.index));
        this.app.use(router);
    }
}
var server = Server.bootstrap();
module.exports = server.app;
