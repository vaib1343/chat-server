const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const routes = require("./routes/auth.route");
const mongoose = require("mongoose");
const setwebsocketServer = require("./websocket");
const server = require("./websocket");
require("./websocket");
app.use(express.json());
app.use(cors());

app.use("/api", routes);

mongoose.connect(
    process.env.MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => {
        console.log(`Database is connected`);
    }
);

setwebsocketServer(app);
