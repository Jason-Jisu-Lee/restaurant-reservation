import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import ErrorAlert from "../../layout/ErrorAlert";
import { listTables, updateSeat, readReservation } from "../../utils/api";

function Seat() {
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({})
  const [error, setError] = useState(null);
  const [table_id, setTableID] = useState("");

  const { reservation_id } = useParams();
  const history = useHistory();

  // Loads all tables and reservation with the given id
  useEffect(() => {
    const abortController = new AbortController();
    setTables([]);
    setReservation({})
    async function loadTables() {
      try {
        const loadTables = await listTables(abortController.signal);
        const freeTables = loadTables.filter((table) => table.reservation_id === null)
        const loadReservation = await readReservation(reservation_id, abortController.signal)
        setTables(freeTables);
        setReservation(loadReservation)
      } catch (errors) {
        setError(errors);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [reservation_id]);

  // Check whether the table can fit the party
  const changeHandler = ({ target }) => {
    const findTable = tables.find((table) => Number(target.value) === table.table_id)
    if(!findTable) {
      setError({message: `Select a table`})
    } else if (findTable.capacity < reservation.people) {
      setError({message: `Select a table with larger capacity that can fit the entire party`})
    } else {
      setError(null)
    }
    setTableID(Number(target.value));
  };

  // Update the table data to assign the given reservation id and send the user to dashboard
  const submitHandler = (event) => {
    event.preventDefault();
    if(!error) {
    updateSeat(table_id, reservation_id)
    .then(() => history.push(`/dashboard`))
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="table_id">
          Table Number
          <select
            id="table_id"
            name="table_id"
            onChange={changeHandler}
            value={table_id}
          >
            <option value="">Select a Table</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </label>
        <div>
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
      </form>
      <ErrorAlert error={error} />
    </div>
  );
}

export default Seat;
