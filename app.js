require("dotenv").config();

const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketIo(server);
global.io = io

const { swaggerUi, specs } = require("./config/swager");



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const connectDb = require("./config/config");
app.use(express.json());

const cors = require("cors");

const userRouter = require("./src/routers/userRoute");
const gamifyRouter = require("./src/routers/gamifyRoute");
const errorHandler = require("./src/middlewares/errorHandler");
const {task1} = require("./src/jobs/cron")

app.use("/api/v1/user", userRouter);
app.use("/api/v1/gamify", gamifyRouter);

task1.start()




connectDb();

app.use(cors());

app.use(errorHandler);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  

 

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  