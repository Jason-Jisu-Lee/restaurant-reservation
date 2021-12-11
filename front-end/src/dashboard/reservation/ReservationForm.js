import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";
import { today } from "../../utils/date-time";
import ErrorAlert from "../../layout/ErrorAlert";

function ReservationForm() {
  //Formats reservation date to set default value to today
  const date = today();

  const history = useHistory();
  const [error, setError] = useState(null);

  //Default form data properties
  const initialData = {
    first_name: "",
    last_name: "",
    reservation_date: date,
    reservation_time: "17:00",
    mobile_number: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initialData);

  //Changes the data values dynamically
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const peopleHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: parseInt(target.value),
    });
  };

  //Saves the form data and display /dashboard page for the date of the new reservation
  const submitHandler = (event) => {
    event.preventDefault();

    // if validation didn't pass, use window object to alert without submitting
    createReservation(formData);
    history.push(`/dashboard?date=${formData.reservation_date}`);
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
              onChange={peopleHandler}
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
