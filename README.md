# Restaurant Reservation System

## Summary

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

## Technology
- JavaScript
- HTML
- CSS
- React
- Express
- Knex
- Postgres

## Objective

