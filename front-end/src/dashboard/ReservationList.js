import React from "react";

function ReservationList({ reservations }) {
  const reservation = reservations.map((reservation, key) => {
    return (
      <tbody key={key}>
        <tr>
          <th>{key + 1}</th>
          <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td className="mr-0 pr-0">{reservation.mobile_number}</td>
          <td>
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-success">Seat</button>
            </a>
          </td>
        </tr>
      </tbody>
    );
  });

  return (
    <div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <td>Name</td>
            <td>Time</td>
            <td>People</td>
            <td>Phone</td>
            <td>Seating</td>
          </tr>
        </thead>
        {reservation}
      </table>
    </div>
  );
}

export default ReservationList;
