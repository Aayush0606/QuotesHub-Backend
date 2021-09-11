import Express from "express";

const Router = Express.Router();

Router.get("/", (req, res) => {
  res.send("Hello Im Route Quotes");
});

export default Router;
