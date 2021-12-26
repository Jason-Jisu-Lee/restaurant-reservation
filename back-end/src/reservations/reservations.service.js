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
    .then((newReservation) => {
      return newReservation[0];
    });
}

// Updates reservation status from "booked" to "seated"
function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status }, "*");
}

module.exports = {
  list,
  create,
  read,
  updateStatus,
};
