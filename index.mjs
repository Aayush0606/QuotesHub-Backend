import Express from "express";
import cors from "cors";
import connectToMongo from "./dataBase.mjs";
import Auth from "./routes/Auth.mjs";
import Quotes from "./routes/Quotes.mjs";
connectToMongo();

const App = Express();

const port = 8000;

App.use(cors());
App.use(Express.json());

App.get("/", (req, res) => {
  res.send("Hello");
});

App.use("/api/auth", Auth);
App.use("/api/quotes", Quotes);

App.listen(port, () => {
  console.log(`Server ruuning at http://localhost:${port}`);
});
