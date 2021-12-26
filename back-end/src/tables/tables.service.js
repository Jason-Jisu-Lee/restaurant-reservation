const knex = require("../db/connection");

// Lists all tables
function list() {
  return knex("tables").select("*").orderBy("table_name");
}

// Creates a new table
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((newTable) => newTable[0]);
}

// Lists the table with the given id
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

// Update a table to change the status
function updateTable(table_id, reservation_id) {
  return knex.transaction((trx) => {
    knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id }, "*")
      .then(() => {
        return knex("reservations")
          .select("*")
          .where({ reservation_id })
          .update({ status: "seated" });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

function finishTable(table_id, reservation_id) {
  return knex.transaction((trx) => {
    knex("tables")
      .select("*")
      .where({ table_id })
      .update({ reservation_id: null }, "*")
      .then(() => {
        return knex("reservations")
          .select("*")
          .where({ reservation_id })
          .update({ status: "finished" });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

module.exports = {
  list,
  read,
  create,
  updateTable,
  finishTable,
};
