const express = require("express");
const app = express();
const port = 5000;

const mongoDB = require("./db");

mongoDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origins, X-Requested-with,Content-Type,Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World this");
});
app.use(express.json());
app.use("/api", require("./Routes/createUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

app.listen(port, () => {
  console.log("app is listening on " + { port });
});
