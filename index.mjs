import Express from "express";
import cors from "cors";
import connectToMongo from "./dataBase.mjs";
import Auth from "./routes/Auth.mjs";
import Quotes from "./routes/Quotes.mjs";
import http from "http";
import { Server, Socket } from "socket.io";
connectToMongo();
import dotenv from "dotenv";
dotenv.config();

const App = Express();
const server = http.createServer(App);

const port = process.env.PORT || 8000;

App.use(cors());
App.use(Express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);

  socket.on("join_chat", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected : ${socket.id}`);
  });
});

App.get("/", (req, res) => {
  res.send("Hello");
});

App.use("/api/auth", Auth);
App.use("/api/quotes", Quotes);

server.listen(port, () => {
  console.log(`Server ruuning at http://localhost:${port}`);
});
