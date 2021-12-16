import React from "react";

function ReservationList({reservations}) {
console.log(reservations)


	/*
	const reservation = reservations.map((reservation, key) => {

	})*/

    return (
    <div>
        {JSON.stringify(reservations)}
    </div>
    )
}

export default ReservationList