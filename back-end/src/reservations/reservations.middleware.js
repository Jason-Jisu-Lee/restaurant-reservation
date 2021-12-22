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

function currentTime() {
  return formatAsTime(
    new Date().toLocaleString("en-US-u-hc-h24", {
      timeZone: "America/New_York",
    })
  );
}

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
      data.reservation_time <= currentTime())
  ) {
    return next({
      status: 400,
      message: `The reservation date cannot be in the past. Please pick a date in the future.`,
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
  return next();
}

module.exports = {
  validateProperties,
};
