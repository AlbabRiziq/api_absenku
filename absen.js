import express, { query } from "express";
import { Int32, MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
const dbName = "absenku";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = client.db(dbName);

const date = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

const Absen = (nisn) => {
  db.collection("dataAbsen")
    .findOne({ nisn })
    .then((data) => {
      if (data) {
        console.log("Nisn tersedia");
      } else {
        console.log("Nisn tidak tersedia");
      }
    });
};

export default Absen;
