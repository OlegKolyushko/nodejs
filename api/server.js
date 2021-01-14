const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRouters = require('./contacts/contacts.routers');
require('dotenv').config();

 module.exports = class UserServer {
    constructor() {
        this.server = null;
    }

    start() {
        this.initServer();
        this.initMiddlewares();
        this.initRoutes();
        this.startListening();
    }

    initServer() {
        this.server = express();
    }

    initMiddleware() {
        this.server.use(express.json());
        this.server.use(morgan('dev'));
        this.server.use(cors({origin: 'http://localhost:3000'}));
    }

    initRoutes() {
        this.server.use('/contacts', contactsRouters);
    }

    startListening() {
        this.server.listen(process.env.PORT, () => {
            console.log('Server started listening on port:', process.env.PORT)
        })
    }
}