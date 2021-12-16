import React, { useState } from "react";
import { useHistory } from "react-router";

function Table() {
  const history = useHistory();
  const initialForm = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${formData.reservation_date}`);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="table_name">Table Name</label>
        <input
          required
          id="table_name"
          name="table_name"
          type="text"
          min="2"
          onChange={changeHandler}
          value={formData.table_name}
        />

        <label htmlFor="capacity">Table Capacity</label>
        <input
          required
          id="capacity"
          name="capacity"
          min="1"
          type="number"
          onChange={changeHandler}
          value={formData.capacity}
        />
      </form>
      <button type="submit" className="btn btn-primary btn">
        Submit
      </button>
      <button
        className="btn btn-primary btn ml-5"
        onClick={() => history.goBack()}
      >
        Cancel
      </button>
    </div>
  );
}

export default Table;
