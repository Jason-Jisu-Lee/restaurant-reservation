const reservationService = require("../reservations/reservations.service");
const service = require("./tables.service");

// Checks whether the table with the given id exists
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await service.read(tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `table_id ${tableId} does not exist`,
  });
}

// Checks whether the reservation with the given id exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${reservation_id} does not exist`,
  });
}

function validProperties(req, res, next) {
  const { data = {} } = req.body;

  // Checks table name and capacity validity
  if (!data.table_name || data.table_name.length < 2) {
    return next({
      status: 400,
      message: `'table_name' must be at least two characters.`,
    });
  }
  if (!data.capacity || data.capacity < 1) {
    return next({
      status: 400,
      message: `'capacity' of the table must be at least one.`,
    });
  }
  if (!Number.isInteger(data.capacity)) {
    return next({
      status: 400,
      message: `'capacity' of the table must be a number.`,
    });
  }
  return next();
}

function validPropertiesUpdate(req, res, next) {
  const { data = {} } = req.body;
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: "'reservation_id' is missing.",
    });
  }
  return next();
}

function validTable(req, res, next) {
  const { table, reservation } = res.locals;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message:
        "The number of people exceeds the maximum capacity of the table.",
    });
  }
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "The table is occupied. Please select another table",
    });
  }
  return next();
}

// Checks whether the table is already free
function validTableId(req, res, next) {
  const { table } = res.locals;
  if (!table.reservation_id) {
    return next({
      status: 400,
      message:
        "The table is not occupied",
    });
  }
  return next()
}


// Checks whether a reservation assigned to the table already has "seated" status 
function seatedReservation(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "seated") {
    return next({
      status: 400,
      message:
        "The reservation has already been seated.",
    });
  }
  next()
}

module.exports = {
  validProperties,
  validPropertiesUpdate,
  reservationExists,
  tableExists,
  validTable,
  validTableId,
  seatedReservation
};
