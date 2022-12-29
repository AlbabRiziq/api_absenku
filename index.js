import express, { query } from "express";
import cors from "cors";
import { Int32, MongoClient } from "mongodb";

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

  app.get("/akun", (req, res) => {
    res.send("COY");
  });
  app.post("/absen", (req, res) => {
    console.log(req);
  });

  app.get("/api/login", (req, res) => {
    db.collection("userData")
      .findOne({ nama: req.query.nama, nisn: Int32(req.query.nisn) })
      .then((data) => {
        if (data) {
          res.send(true);
        } else {
          res.send(false);
        }
        console.log(req.query);
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
