import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationList from "./reservation/ReservationList"
import {useHistory} from "react-router-dom"

function Dashboard() {
  const todayDate = today();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(todayDate);


  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }, [date]);

  const query = useQuery();
  const queryDate = query.get("date");
  useEffect(() => {
    if (queryDate && queryDate !== "") {
      setDate(queryDate);
    }
  }, [queryDate]);

  const history = useHistory();

  const previousHandler = (event) => {
    event.preventDefault();
    setDate(previous(date));
    history.push(`/dashboard?date=${previous(date)}`)
  };
  const todayHandler = (event) => {
    event.preventDefault();
    setDate(todayDate);
    history.push(`/dashboard?date=${todayDate}`)
  };
  const nextHandler = (event) => {
    event.preventDefault();
    setDate(next(date));
    history.push(`/dashboard?date=${next(date)}`)
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      {JSON.stringify(reservations)}

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
    <div>
      <ReservationList reservations={reservations}/>
    </div>

    </main>
  );
}

export default Dashboard;
