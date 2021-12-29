import React from "react";
import { useHistory } from "react-router-dom";
import { finishTable } from "../utils/api";

function TablesList({ tables }) {
  const history = useHistory();

  // If the table's reservation_id is not null, change the status to "Occupied" from "Free"
  // Clicking "Finish" will change the status back to "Free" from "Occupied" by sending a 'DELETE' request
  const tableList = tables.map((table, key) => {
    const finishHandler = () => {
      if (window.confirm("Is this table ready to seat new guests?")) {
        finishTable(table.table_id).then(() => history.go(0));
      }
    };
    const status = !table.reservation_id ? "Free" : "Occupied";
    const reservationNumber = table.reservation_id ? table.reservation_id : "-";
    const emptyTable = table.reservation_id ? (
      <button
        onClick={finishHandler}
        className="btn btn-danger"
        data-table-id-finish={table.table_id}
      >
        Finish
      </button>
    ) : (
      "-"
    );
    return (
      <tbody key={key}>
        <tr>
          <th>{table.table_name}</th>
          <td>{table.capacity}</td>
          <td data-table-id-status={table.table_id}>{status}</td>
          <td>{reservationNumber}</td>
          <td>{emptyTable}</td>
        </tr>
      </tbody>
    );
  });

  return (
    <div className="mt-4">
      <table className="table table-sm table-hover col-10">
        <thead className="table-secondary">
          <tr>
            <th className="col-1">Table</th>
            <td className="col-2">Capacity</td>
            <td className="col-1">Status</td>
            <td className="col-3">Reservation #</td>
            <td>Finish</td>
          </tr>
        </thead>
        {tableList}
      </table>
    </div>
  );
}

export default TablesList;
