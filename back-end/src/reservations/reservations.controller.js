const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const { validateProperties } = require("./reservations.middleware");

// Checks whether a reservation with the given id exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation does not exist with the following id: ${reservationId}.`,
    });
  }
}

// Lists reservations by date
async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

// Loads a reservation with the given id
async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// Creates a reservation from the reservation form
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(reservationExists), read],
  create: [validateProperties, asyncErrorBoundary(create)],
};
