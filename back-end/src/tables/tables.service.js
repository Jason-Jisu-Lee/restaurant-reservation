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

// Update a table to change the status to "Occupied"
function updateTable(table_id, reservation_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .update({ reservation_id }, "*")
    .then((updatedTable) => updatedTable[0]);
}

// Lists the table with the given id
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

// Updates a table's reservation id to change the status back to "Free"
function finish(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .update({ reservation_id: null }, "*");
}

module.exports = {
  list,
  read,
  create,
  updateTable,
  finish,
};
