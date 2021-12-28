import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { previous, next, today } from "../utils/date-time";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "./ReservationList";
import TablesList from "./TablesList";

function Dashboard() {
  const todayDate = today();

  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(todayDate);
  const [tables, setTables] = useState([]);

  // Loads reservation with the given date
  useEffect(() => {
    const abortController = new AbortController();
    async function loadReservations() {
      try {
        const loadR = await listReservations({ date }, abortController.signal);
        setReservations(loadR)
      } catch (errors) {
        setError({message: errors});
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date]);

  // Loads all tables
  useEffect(() => {
    setTables([])
    const abortController = new AbortController();
    async function loadTables() {
      try {
        const loadTables = await listTables(abortController.signal);
        setTables(loadTables);
      } catch (errors) {
        setError({ message: errors });
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

  // Uses query to set date
  const query = useQuery();
  const queryDate = query.get("date");
  useEffect(() => {
    if (queryDate && queryDate !== "") {
      setDate(queryDate);
    }
  }, [queryDate]);

  const history = useHistory();

  // Clicking on 'Previous Day,' 'Today,' and 'Next Day' will send the user to the appropriate route with a date query
  const previousHandler = (event) => {
    event.preventDefault();
    setDate(previous(date));
    history.push(`/dashboard?date=${previous(date)}`);
  };
  const todayHandler = (event) => {
    event.preventDefault();
    setDate(todayDate);
    history.push(`/dashboard?date=${todayDate}`);
  };
  const nextHandler = (event) => {
    event.preventDefault();
    setDate(next(date));
    history.push(`/dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={error} />
      <div className="row">
        <button className="btn btn-primary btn ml-3" onClick={previousHandler}>
          Previous Day
        </button>
        <button className="btn btn-primary btn ml-3" onClick={todayHandler}>
          Today
        </button>
        <button className="btn btn-primary btn ml-3" onClick={nextHandler}>
          Next Day
        </button>
      </div>
      <ReservationList reservations={reservations} />
      <TablesList tables={tables} />
    </main>
  );
}

export default Dashboard;
