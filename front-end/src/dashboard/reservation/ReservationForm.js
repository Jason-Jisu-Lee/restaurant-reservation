import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import { today, currentTime } from "../../utils/date-time";
import ErrorAlert from "../../layout/ErrorAlert";

function ReservationForm() {
  // Formats reservation date to set default value to today

  const history = useHistory();
  const [error, setError] = useState(null);

  // Default form data properties
  const initialData = {
    first_name: "",
    last_name: "",
    reservation_date: "",
    reservation_time: "17:00",
    mobile_number: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initialData);

  // Changes the data values dynamically
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  // Saves the form data and displays /dashboard page for the date of the new reservation,
  // but displays an error message if any validation fails
  const submitHandler = (event) => {
    event.preventDefault();
    let errors = "";

    // DATE VALIDATION //

    // Checks whether the date is on a Tuesday
    if (new Date(formData.reservation_date).getDay() === 1) {
      errors +=
        "Our restaurant is closed on Tuesdays. Please select a different day.";
    }
    // Checks whether the date is in the past
    if (
      formData.reservation_date < today() ||
      (formData.reservation_date === today() &&
        formData.reservation_time <= currentTime())
    ) {
      errors += ` The reservation date cannot be in the past. Please pick a date in the future.`;
    } else {
      setError(null);
    }

    // TIME VALIDATION //

    const requestedTime = new Date(
      formData.reservation_date + " " + formData.reservation_time
    );
    const openingTime = new Date(`${formData.reservation_date} 10:30:00`);
    const lastCallTime = new Date(`${formData.reservation_date} 21:30:00`);
    // Checks whether the reservation time is before 10:30 am and after 9:30 pm
    if (requestedTime < openingTime || requestedTime > lastCallTime) {
      errors += ` Please select a time between 10:30 AM (restaurant closes) and 9:30 PM (last call before closing at 10:30 PM); Time Requested: ${formData.reservation_time}`;
    } else {
      setError(null);
    }

    // Pushes all the errors, if any, into the 'errors' array and set 'error' to the 'errors' array which will be displayed through the 'ErrorAlert' component
    if (errors.length) {
      setError({ message: errors });
    }

    if (!errors) {
      createReservation({
        ...formData,
        people: Number(formData.people),
      });
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } else return null;
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <div className="row">
            <div className="col-6">
              <label htmlFor="first_name">First Name</label>
              <input
                required
                id="first_name"
                name="first_name"
                type="text"
                onChange={changeHandler}
                value={formData.first_name}
                placeholder="First Name"
              />
            </div>
            <div className="col-6">
              <label htmlFor="last_name">Last Name</label>
              <input
                required
                id="last_name"
                name="last_name"
                type="text"
                onChange={changeHandler}
                value={formData.last_name}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="row">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              required
              id="mobile_number"
              name="mobile_number"
              type="tel"
              onChange={changeHandler}
              value={formData.mobile_number}
              placeholder="123-456-7890"
            />
          </div>
          <div className="row">
            <div className="col-4">
              <label htmlFor="reservation_date">Reservation Date</label>
              <input
                required
                id="reservation_date"
                name="reservation_date"
                type="date"
                onChange={changeHandler}
                value={formData.reservation_date}
              />
            </div>
            <div className="col-4">
              <label htmlFor="reservation_time">Reservation Time</label>
              <input
                required
                id="reservation_time"
                name="reservation_time"
                type="time"
                onChange={changeHandler}
                value={formData.reservation_time}
              />
            </div>
          </div>
          <div className="row">
            <label htmlFor="people">Number of people in the party</label>
            <input
              required
              id="people"
              name="people"
              type="number"
              onChange={changeHandler}
              value={formData.people}
            />
          </div>
        </div>
        <div>
          <ErrorAlert error={error} />
        </div>
        <button type="submit" className="btn btn-primary btn">
          Submit
        </button>
        <button
          className="btn btn-primary btn ml-5"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;