const express = require("express");
require("express-async-errors");
require("dotenv").config();
require("colors");
const cors = require("cors");

const usersRouter = require("./routes/users.js");
const errorHandler = require("./middlewares/errorHandler.js");

const app = express();

const port = process.env.PORT || 2000;

const connectDB = require("./config/db.js");
const auth = require("./middlewares/auth.js");
const jobsRouter = require("./routes/jobs.js");
const clientRouter = require("./routes/clients.js");

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

connectDB();

app.use(usersRouter);
app.use("/jobs", jobsRouter);
app.use("/clients", clientRouter);

app.use((_, res) => {
    res.status(404).send("page not found!!!");
});

app.use(errorHandler);

app.listen(port, () => console.log(`server up and running... on port ${port}`));

module.exports = app;
