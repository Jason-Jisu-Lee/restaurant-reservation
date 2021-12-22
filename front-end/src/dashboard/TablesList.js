import React from "react";

function TablesList({ tables }) {
  const table = tables.map((table, key) => {
    const status = !table.reservation_id ? "Free" : "Occupied";
    return (
      <tbody key={key}>
        <tr>
          <th>{table.table_name}</th>
          <td>{table.capacity}</td>
          <td data-table-id-status={table.table_id}>{status}</td>
          <td>{table.reservation_id}</td>
        </tr>
      </tbody>
    );
  });

  return (
    <div className="mt-4">
      <table className="table table-sm">
        <thead>
          <tr>
            <th cope="col">Table</th>
            <td>Capacity</td>
            <td>Status</td>
            <td>Reservation #</td>
          </tr>
        </thead>
        {table}
      </table>
    </div>
  );
}

export default TablesList;
