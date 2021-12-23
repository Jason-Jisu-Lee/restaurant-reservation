const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const {
  validProperties,
  validPropertiesUpdate,
  validTable,
  validTableId,
  reservationExists,
  tableExists,
} = require("./tables.middleware");

// Lists all tables
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

// Creates a table
async function create(req, res) {
  const table = await service.create(req.body.data);
  res.status(201).json({ data: table });
}

// Update the table's status
async function updateTable(req, res) {
  const { table, reservation } = res.locals;
  const updatedTable = await service.updateTable(
    table.table_id,
    reservation.reservation_id
  );
  res.json({ updatedTable });
}

// Updates a table's reservation id to change the status back to "Free"
async function destroy(req, res) {
  const { table } = res.locals;
  await service.finish(table.table_id);
  const data = await service.list();
  res.json({ data });
}

module.exports = {
  list,
  create: [validProperties, asyncErrorBoundary(create)],
  updateTable: [
    validPropertiesUpdate,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    validTable,
    asyncErrorBoundary(updateTable),
  ],
  delete: [asyncErrorBoundary(tableExists),
    validTableId,
    asyncErrorBoundary(destroy)],
};
