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

  // Checks whether 'reservation_time' property is valid
  console.log(data.reservation_time)
  if (!data.reservation_time || !data.reservation_time.match(/\d\d:\d\d/)) {
    return next({
      status: 400,
      message: `Please enter a valid 'reservation_time' property: ${data.reservation_time}`,
    });
  }

  return next();
}

module.exports = {
  validateProperties,
};
