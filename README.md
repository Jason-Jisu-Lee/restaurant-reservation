# Restaurant Reservation System

## Summary
This is a full stack web-based restaurant schedule management application that allows the user to create/edit/delete reservations. The user can then create tables, assign capacity to the table and seat reservations.

The reservations can be filtered by phone number and date, and sorted by their status among booked, seated, and finished.

[Live Demo being deployed on the 12/30th](www.github.com)

## Installation

1. Fork and clone this repository.
2. Create and update `./back-end/.env` file with the connection URL's to your database instance.
3. Create `./front-end/.env` file and include the backend connection within `./front-end/.env`.
4. Run `npm install` to install project dependencies.
5. Run `npm run start` to start the server.

## API Endpoints

| URL | Method | Description |
| ---------------- | ----- | ---------------------------------------------------------------- |
| `/reservations` | POST | Creates a new reservation |
| `/reservations?date=YYYY-MM-DD` | GET | Lists all reservations with the given date |
| `/reservations?mobile_number=123-456-7890` | GET | Lists all reservations with the given phone number |
| `/reservations/:reservationid` | GET | Reads a reservation by reservation_id |
| `/reservations/:reservationid` | PUT | Updates a reservation by reservation_id |
| `/reservations/:reservationid/status` | PUT | Updates the status of a reservation by reservation_id  |
| `/tables` | POST | Creates a new table |
| `/tables` | GET | Lists all tables |
| `/tables/:tableid/seat` | PUT | Seats a reservation at a table |
| `/tables/:tableid/seat` | DELETE | Clears an occupied table |


## App Features

### Managing Reservations
The dashboard lists the reservations for today by default. The user can click 'previous' and 'next' button on top of the table to view past or future reservations.

The tables and their availability are listed under reservations.

![Dashboard](https://github.com/Jason-Jisu-Lee/restaurant-reservation/blob/main/images/Dashboard.png)

### Creating A Reservation
The user can create a reservation in the 'New Reservation' tab on the left navigation bar. The reservation requires the customer's first name, last name, reservation date, reservation time, quantity of guests, and mobile number.

![NewReservation](https://github.com/Jason-Jisu-Lee/restaurant-reservation/blob/main/images/NewReservation.png)

### Searching for a Specific Reservation
The user can search for a reservation(s) by the mobile number associated with the reservation in the 'Search' tab as well; the search function can detect partial matches and will list every reservation that matches the given number.

![Search](https://github.com/Jason-Jisu-Lee/restaurant-reservation/blob/main/images/Search.png)

### Managing Tables
The user can create new tables in the 'New Table' tab and assign its capacity.

![NewTable](https://github.com/Jason-Jisu-Lee/restaurant-reservation/blob/main/images/NewTable.png)


## API

### Create Reservation
**POST** `/reservations`
  - Required body:
    | Param      |  type     |
    | ---------- | ---------- |
    | `first_name` | `str` |
    | `last_name` | `str` |
    | `people` | `int` |
    | `reservation_date` | `date` |
    | `reservation_time` | `str` |
    | `mobile_number` | `str` |
    
   
### Get Reservations by Date
**GET** `/reservations?date=<reservation_date>`
Returns reservations for a particular date


### Get Reservations by Id
 `/reservations/:reservation_id`


#### Available Methods
- **GET** - Returns a reservation given an existing reservation Id
- **PUT** - Modifies an existing reservation given an existing reservation Id
  - Required params:
    - `reservation_id (int)`
  - Required body:
    | Param      |  type     |
    | ---------- | ---------- |
    | `first_name` | `str` |
    | `last_name` | `str` |
    | `people` | `int` |
    | `reservation_date` | `date` |
    | `reservation_time` | `str` |
    | `mobile_number` | `str` |


### Get Reservation Status
**GET** `/reservations/:reservation_id/status`
Returns a status of [ `booked, seated, finished, cancelled` ] for the particular reservation


### Get Tables
- **GET** `/tables`
Returns the available tables.


### Create Table
- **POST** `/tables`

Creates a table to be listed in the table list.

 - Required body:
    | Param      |  type     |
    | ---------- | ---------- |
    | `table_name` | `str` |
    | `capacity` | `int` |


### Update Table Status
- **PUT** `/tables/:table_id/seat`

Sets table status to 'occupied' and ties a `restaurant_id` to it.

 - Required body:
    | Param      |  type     |
    | ---------- | ---------- |
    | `reservation_id` | `int` |


### Finish Table
- **DELETE** `/tables/:table_id/seat`

Sets the table status to `free` and the accompanying reservation status to `finished`
 - Required body:
    | Param      |  type     |
    | ---------- | ---------- |
    | `reservation_id` | `int` |


## Technology
- JavaScript
- HTML
- CSS
- React
- Express
- Knex
- Postgres
