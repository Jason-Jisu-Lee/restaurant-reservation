const knex = require("../db/connection");

// Lists reservations by date
function list(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
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
    .update({ status });
}

// Sets the reservation status to "finished"
function finish(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: "finished" });
}

// Lists reservation list with a matching mobile number
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

// Updates existing reservation's entire data
function edit(reservation) {
  return knex("reservations")
  .select("*")
  .where({ reservation_id: reservation.reservation_id})
  .update(reservation)
  .returning("*")
  .then((updatedReservation) => updatedReservation[0])
}

module.exports = {
  list,
  create,
  read,
  updateStatus,
  search,
  finish,
  edit
};
