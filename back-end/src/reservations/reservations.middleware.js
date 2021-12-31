const service = require("./reservations.service");

// Aids in formatting current time using EST time zone
const timeFormat = /\d\d:\d\d/;
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}
function today() {
  return asDateString(new Date());
}
function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

// Checks whether the properties of requested body are valid
function validateProperties(req, res, next) {
  const { data = {} } = req.body;

  // Define required properties and requested properties
  const requiredProperties = [
    "first_name",
    "last_name",
    "reservation_date",
    "reservation_time",
    "mobile_number",
    "people",
  ];
  const givenProperties = Object.keys(data);

  // Loops required properties array and pushes whatever properties it is missing onto a new array
  const notHave = [];
  for (let property of requiredProperties) {
    if (!givenProperties.includes(property) || !data[property]) {
      notHave.push(property);
    }
  }

  // If there's at least one element in the new array, send error message
  if (notHave.length > 0) {
    return next({
      status: 400,
      message: `The required field '${notHave}' is missing.`,
    });
  }

  // Checks whether 'people' property is valid
  if (!data.people || data.people === 0 || !Number.isInteger(data.people)) {
    return next({
      status: 400,
      message: `Please enter a valid number for the 'people' property: ${data.people}`,
    });
  }

  // Checks whether 'reservation_date' property is valid
  if (!Date.parse(data.reservation_date)) {
    return next({
      status: 400,
      message: `Please enter a valid date for the 'reservation_date' property: ${data.reservation_date}`,
    });
  }

  // Checks whether 'reservation_date' property is a Tuesday
  if (new Date(data.reservation_date).getDay() === 1) {
    return next({
      status: 400,
      message: `Our restaurant is closed on Tuesdays. Please enter a valid date for the 'reservation_date' property: ${data.reservation_date}`,
    });
  }

  // Checks whether 'reservation_date' property is in the past
  if (
    data.reservation_date < today() ||
    (data.reservation_date === today() &&
      data.reservation_time <= formatAsTime(new Date().toTimeString()))
  ) {
    return next({
      status: 400,
      message: `The reservation date cannot be in the past. Please select a date in the future.`,
    });
  }

  // Checks whether 'reservation_time' property is valid
  if (!data.reservation_time || !data.reservation_time.match(/\d\d:\d\d/)) {
    return next({
      status: 400,
      message: `Please enter a valid 'reservation_time' property: ${data.reservation_time}`,
    });
  }

  // Checks whether 'reservation_time' property is between 9:30 PM and 10:30 AM and displays error if so
  const requestedTime = new Date(
    data.reservation_date + " " + data.reservation_time
  );
  const openingTime = new Date(data.reservation_date + " " + "10:30:00");
  const lastCallTime = new Date(data.reservation_date + " " + "21:30:00");
  if (requestedTime < openingTime || requestedTime > lastCallTime) {
    return next({
      status: 400,
      message: `Please select a time between 10:30 AM (restaurant closes) and 9:30 PM (last call before closing at 10:30 PM); Time Requested: ${data.reservation_time}`,
    });
  }
  next();
}

// Checks whether the reservation status is "seated" or "finished"
function validateStatus(req, res, next) {
  const { data = {} } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: `The reservation has already been seated or is finished`,
    });
  }
  next();
}

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

// Checks whether the reservation has a "finished" or unknown status
function validateStatusFinished(req, res, next) {
  const { reservation } = res.locals;
  const status = req.body.data.status;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: `Reservation is currently finished.`,
    });
  }
  const properStatus = ["booked", "seated", "finished", "cancelled"];
  if (!properStatus.includes(status)) {
    return next({
      status: 400,
      message: `Reservation has an unknown status.`,
    });
  }
  next();
}

module.exports = {
  validateProperties,
  validateStatus,
  reservationExists,
  validateStatusFinished,
};
