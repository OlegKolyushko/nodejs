const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactsRouters = require("./contacts/contacts.routers");
const mongoose = require("mongoose");
require("dotenv").config();


module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDB();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(morgan("dev"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouters);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port:", process.env.PORT);
    });
  }

  async initDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log("Database connection successful");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
};
