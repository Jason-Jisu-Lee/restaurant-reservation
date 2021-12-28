const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const {
  validateProperties,
  validateStatus,
  reservationExists,
  validateStatusFinished,
} = require("./reservations.middleware");

// Lists reservations by date
async function list(req, res) {
  const { date = null, mobile_number = null } = req.query;
  if (date) {
    const results = await service.list(date);
    const data = results.filter(
      (reservation) => reservation.status !== "finished"
    );
    return res.json({ data });
  }
  const data = await service.search(mobile_number);
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

// Updates reservation status from "booked" to "seated"
async function updateStatus(req, res) {
  const { reservation } = res.locals;
  const { status } = req.body.data;
  await service.updateStatus(reservation.reservation_id, status);
  res.json({ data: { status } });
}

// Updates existing reservation's entire data
async function editReservation(req, res) {
  const data = await service.edit(req.body.data);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [validateProperties, validateStatus, asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(reservationExists),
    validateStatusFinished,
    asyncErrorBoundary(updateStatus),
  ],
  edit: [
    asyncErrorBoundary(reservationExists),
    validateProperties,
    validateStatus,
    asyncErrorBoundary(editReservation),
  ],
};
