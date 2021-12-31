import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  createReservation,
  editReservation,
  readReservation,
} from "../../utils/api";
import { today, currentTime, formatAsDate } from "../../utils/date-time";
import ErrorAlert from "../../layout/ErrorAlert";

// Formats date for reservation data called with id
function formatDate(reservation) {
  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  return reservation;
}

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
  const [editData, setEditData] = useState(initialData);
  const { reservation_id } = useParams();
  let currentForm = formData;
  if (reservation_id) {
    currentForm = editData;
  }

  // Loads the reservation with a given id from params, pre-filling the data
  useEffect(() => {
    const abortController = new AbortController();
    async function loadReservation() {
      try {
        const reservationData = await readReservation(
          reservation_id,
          abortController.signal
        );
        // set the reservationData like (...formData, reservation_date: CHANGE FORMAT)
        setEditData(formatDate(reservationData));
      } catch (errors) {
        setError(errors);
      }
    }
    if (reservation_id) {
      loadReservation();
    }
    return () => abortController.abort();
  }, [reservation_id]);

  // Changes the data values dynamically
  // If reservation_id is found in the query, use "editData" to save data
  const changeHandler = ({ target }) => {
    setError(null);

    if (reservation_id) {
      setEditData({
        ...editData,
        [target.name]: target.value,
      });
    }
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
    if (new Date(currentForm.reservation_date).getDay() === 1) {
      errors +=
        "Our restaurant is closed on Tuesdays. Please select a different day.";
    }
    // Checks whether the date is in the past
    if (
      currentForm.reservation_date < today() ||
      (currentForm.reservation_date === today() &&
        currentForm.reservation_time <= currentTime())
    ) {
      errors += ` The reservation date cannot be in the past. Please pick a date in the future.`;
    } else {
      setError(null);
    }

    // TIME VALIDATION //

    const requestedTime = new Date(
      currentForm.reservation_date + " " + currentForm.reservation_time
    );
    const openingTime = new Date(`${currentForm.reservation_date} 10:30:00`);
    const lastCallTime = new Date(`${currentForm.reservation_date} 21:30:00`);
    // Checks whether the reservation time is before 10:30 am and after 9:30 pm
    if (requestedTime < openingTime || requestedTime > lastCallTime) {
      errors += ` Please select a time between 10:30 AM (restaurant closes) and 9:30 PM (last call before closing at 10:30 PM); Time Requested: ${currentForm.reservation_time}`;
    } else {
      setError(null);
    }

    // Pushes all the errors, if any, into the 'errors' array and set 'error' to the 'errors' array which will be displayed through the 'ErrorAlert' component
    if (errors.length) {
      setError({ message: errors });
    }

    if (!errors) {
      // If "reservation_id" was found in the query, sends put request instead of post request
      // And save the data on "editData"; otherwise, save the data on "formData"
      if (reservation_id) {
        editReservation({
          ...editData,
          people: Number(editData.people),
        }).then(() =>
          history.push(`/dashboard?date=${editData.reservation_date}`)
        );
      } else {
        createReservation({
          ...formData,
          people: Number(formData.people),
        }).then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        );
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4 mt-3 center">Add a New Reservation</h2>
      <form onSubmit={submitHandler}>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label" htmlFor="first_name">
            First Name
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              required
              id="first_name"
              name="first_name"
              type="text"
              onChange={changeHandler}
              value={reservation_id ? editData.first_name : formData.first_name}
              placeholder="First Name"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="last_name" className="col-sm-2 col-form-label">
            Last Name
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              required
              id="last_name"
              name="last_name"
              type="text"
              onChange={changeHandler}
              value={reservation_id ? editData.last_name : formData.last_name}
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="mobile_number" className="col-sm-2 col-form-label">
            Mobile Number
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              required
              id="mobile_number"
              name="mobile_number"
              type="tel"
              onChange={changeHandler}
              value={
                reservation_id ? editData.mobile_number : formData.mobile_number
              }
              placeholder="123-456-7890"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-sm-2 col-form-label" htmlFor="reservation_date">
            Reservation Date
          </label>
          <div className="col-sm-2">
            <input
              className="form-control"
              required
              id="reservation_date"
              name="reservation_date"
              type="date"
              onChange={changeHandler}
              value={
                reservation_id
                  ? editData.reservation_date
                  : formData.reservation_date
              }
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="reservation_time" className="col-sm-2 col-form-label">
            Reservation Time
          </label>
          <div className="col-sm-2">
            <input
              className="form-control"
              required
              id="reservation_time"
              name="reservation_time"
              type="time"
              onChange={changeHandler}
              value={
                reservation_id
                  ? editData.reservation_time
                  : formData.reservation_time
              }
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="people" className="col-sm-2 col-form-label">
            # of people in the party
          </label>
          <div className="col-sm-1">
            <input
              className="form-control"
              required
              id="people"
              name="people"
              type="number"
              onChange={changeHandler}
              value={reservation_id ? editData.people : formData.people}
            />
          </div>
        </div>
        <div className="center">
          <ErrorAlert error={error} />
        </div>
        <button type="submit" className="btn btn-primary btn">
          Submit
        </button>
        <button
          className="btn btn-secondary btn ml-5"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
