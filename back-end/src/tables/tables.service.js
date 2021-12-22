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

// Update a table to change the status to "occupied"
function updateTable(table_id, reservation_id) {
  return knex("tables")
    .select("*")
    .where({ table_id })
    .update({ reservation_id }, "*")
    .then((updatedTables) => updatedTables[0]);
}

// Lists the table with the given id
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

module.exports = {
  list,
  read,
  create,
  updateTable,
};
