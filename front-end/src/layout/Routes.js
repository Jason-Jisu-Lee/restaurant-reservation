import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import Table from "../dashboard/table/Table";
import { today } from "../utils/date-time";
import ReservationForm from "../dashboard/reservation/ReservationForm";

function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/tables/new">
        <Table />
      </Route>

      <Route exact path="/reservations/new">
        <ReservationForm />
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
