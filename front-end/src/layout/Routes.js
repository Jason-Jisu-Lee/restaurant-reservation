import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Seat from "../dashboard/table/Seat";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import TableForm from "../dashboard/table/TableForm";
import { today } from "../utils/date-time";
import ReservationForm from "../dashboard/reservation/ReservationForm";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route exact path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
