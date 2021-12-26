// import React, { useState } from "react";
// import ReservationList from "../ReservationList";
// import { readReservation } from "../../utils/api";

// function Search() {
//   /*
//         <Route path="/search">
//         <Search />
//       </Route>
//   */
//   const [reservation, setReservation] = useState({});

//   const changeHandler = (target) => {}

//   const submitHandler = (event) => {
//     event.preventDefault();
//   };

//   // pass on ReservationList component a "reservation"

//   return (
//     <div>
//       <div>
//         <h1>Search Reservation</h1>
//       </div>
//       <form>
//         <label htmlFor="mobile_number">Phone Number</label>
//         <input
//           id="mobile_number"
//           name="mobile_number"
//           type="search"
//           placeholder="Enter a customer's phone number"
//         />
//         <button type="submit" className="btn btn-primary">
//           Find
//         </button>
//       </form>
//       <div>
//         <ReservationList reservation={reservation} />
//       </div>
//     </div>
//   );
// }

// export default Search;
