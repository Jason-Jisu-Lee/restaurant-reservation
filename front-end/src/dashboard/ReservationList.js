import React from "react";
import { useHistory } from "react-router-dom";
import { updateStatus } from "../utils/api"

function ReservationList({ reservations }) {
  const history = useHistory();

  // Maps reservations array to show each reservation's properties
  // Only show reservations with a "booked" status
  const reservation = reservations.map((reservation, key) => {
    // Confirms cancellation of reservation and if confirmed, updates reservation status to "cancelled"
    const cancelHandler = () => {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        updateStatus(reservation.reservation_id);
        history.go(0);
      } return null
    };
    // Clicking the "Edit" button will take the user to 'ReservationForm' component with pre-filled information
    const showSeat =
      reservation.status === "booked" ? (
        <div>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button className="btn btn-outline-success">Seat</button>
          </a>
          <a href={`/reservations/${reservation.reservation_id}/edit`}>
            <button className="btn btn-outline-info">Edit</button>
          </a>
          <button
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={cancelHandler}
            className="btn btn-outline-danger"
          >
            Cancel
          </button>
        </div>
      ) : (
        "-"
      );
    if (reservation.status !== "finished") {
      return (
        <tbody key={key}>
          <tr>
            <th>{reservation.reservation_id}</th>
            <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.mobile_number}</td>
            <td data-reservation-id-status={reservation.reservation_id}>
              {reservation.status}
            </td>
            <td>{showSeat}</td>
          </tr>
        </tbody>
      );
    } else return null;
  });

  // Shows "No reservations found" if there is no reseravtion; otherwise, map reservations
  const list =
    reservation.length === 0 ? (
      <tbody>
        <tr>
          <th>
            <h4>No reservations found</h4>
          </th>
        </tr>
      </tbody>
    ) : (
      reservation
    );

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
            <td>Status</td>
            <td>Action</td>
          </tr>
        </thead>
        {list}
      </table>
    </div>
  );
}

export default ReservationList;
