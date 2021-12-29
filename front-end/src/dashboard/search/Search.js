import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useQuery from "../../utils/useQuery";
import ReservationList from "../ReservationList";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservationsSearch } from "../../utils/api";

function Search() {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  // Use query to set phone number
  const query = useQuery();
  const queryPhone = query.get("mobile_number");

  // Loads reservations matching with the query mobile number if the query exists
  useEffect(() => {
    const abortController = new AbortController();
    setError(null)
    async function loadReservations() {
      if (!queryPhone) return null;
      try {
        const lists = await listReservationsSearch(
          queryPhone,
          abortController.signal
        );
        setReservations(lists);
      } catch (errors) {
        setError(errors)
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [queryPhone]);

  // Sets the query
  const submitHandler = (event) => {
    event.preventDefault();
    history.push(`/search?mobile_number=${phoneNumber}`)
  };

  return (
    <div>
      <div>
        <h1 className="center">Search Reservation</h1>
      </div>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <label className="mr-2" htmlFor="mobile_number">
          Phone Number
        </label>
        <input
          required
          id="mobile_number"
          name="mobile_number"
          type="search"
          placeholder="Enter a customer's phone number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          style={{ width: 245 }}
          className="mr-5"
        />
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      <div className="mt-5">
        <ReservationList reservations={reservations} />
      </div>
    </div>
  );
}

export default Search;
