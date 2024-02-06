require('dotenv').config();
const Sequelize = require ('sequelize');


//const password = process.env.DB_PASSWORD.toString(); // Pastikan password adalah string
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,

    pool: {
      min: 0, // Nilai "min" harus sesuai
      max: 5, // Nilai "max" sesuaikan dengan kebutuhan Anda
      idle: 10000, // Waktu idle sesuaikan dengan kebutuhan Anda
    },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.modul = require("../models/models")(sequelize, Sequelize.DataTypes);

module.exports = db;