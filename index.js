import express, { query } from "express";
import cors from "cors";
import url from "url";
import { Int32, MongoClient } from "mongodb";
import Absen from "./absen.js";
import ShortUniqueId from "short-unique-id";
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

const uuid = new ShortUniqueId({ length: 6 });
console.log(uuid.randomUUID());

const date = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

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

app.post("/api/loginGuru", (req, res) => {});

app.post("/api/absen", (req, res) => {
  const nisn = Int32(req.query.nisn);
  const status = req.query.status;

  db.collection("dataAbsen")
    .findOne({ nisn })
    .then((data) => {
      if (data) {
        db.collection("dataAbsen")
          .updateOne(
            { nisn },
            {
              $push: {
                absen: {
                  tanggal: date(),
                  status,
                },
              },
            }
          )
          .then((data) => {
            res.status(200).send("Sukses");
          });
      } else {
        db.collection("dataAbsen")

          .insertOne({
            nisn,
            absen: [
              {
                tanggal: date(),
                status,
              },
            ],
          })
          .then((data) => {
            res.status(200).send("Sukses");
            // console.log("Nisn tersedia");
          });
        console.log("Nisn tidak tersedia");
      }
    });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
