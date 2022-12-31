import express, { query } from "express";
import cors from "cors";
import url from "url";
import { Int32, MongoClient } from "mongodb";
import Absen from "./absen.js";
const app = express();
const PORT = process.env.PORT || 8080;
const uri = "mongodb://localhost:27017";
const dbName = "absenku";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = client.db(dbName);
// Konek ke mongo db

app.use(cors());

client.connect((err, client) => {
  if (err) {
    console.log(err);
  }

  app.post("/api/absen", (req, res) => {
    db.collection("absen").findOne({
      nisn: req.query.nisn,
    });
  });

  app.get("/api/login", (req, res) => {
    db.collection("userData")
      .findOne({ nama: req.query.nama, nisn: Int32(req.query.nisn) })
      .then((data) => {
        console.log(data);
        if (data) {
          res.send(true);
        } else {
          res.send(false);
        }
        // console.log(Int32(req.query.nisn));
      });
  });
});

app.post("/api/absen", (req, res) => {
  let nisn = Int32(req.query.nisn);
  Absen(nisn);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
