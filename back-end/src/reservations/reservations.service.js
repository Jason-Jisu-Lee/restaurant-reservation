const knex = require("../db/connection");

// Lists reservations by date
function list(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

// Loads a reservation with the given id
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

// Creates a reservation from the reservation form
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((data) => {
      return data[0];
    });
}

module.exports = {
  list,
  create,
  read,
};
