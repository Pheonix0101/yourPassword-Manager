const express = require("express");
const { MongoClient } = require("mongodb");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

require("dotenv").config();
// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
// Database Name
const dbName = "passwordManager";

client.connect();

console.log(url);

app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

app.post("/save", async (req, res) => {
  const db = client.db(dbName);
  const password = req.body;
  const collection = db.collection("passwords");
  const findResult = await collection.insertOne(password)
  res.json({success: true, result:findResult});
});

app.delete("/delete", async (req, res) => {
    const db = client.db(dbName);
    const password = req.body;
    const collection = db.collection("passwords");
    const findResult = await collection.deleteOne(password)
    res.json({success: true, result:findResult});
  });


app.listen(port, () => {
  console.log(`app is listening on http://localhost:${port}/`);
});
