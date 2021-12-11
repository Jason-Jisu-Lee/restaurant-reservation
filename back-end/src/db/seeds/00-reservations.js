const reservations = require("./00-reservationsData.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("reservations").insert(reservations);
    });
};