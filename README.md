# Smart Queue API

A simple REST API for managing a customer queue in a small service center.

## Technologies

- Node.js
- Express
- JavaScript
- SQLite
- better-sqlite3

## Features

The API supports:

- Adding a new customer to the queue
- Listing all waiting customers
- Getting a customer by ID
- Showing a customer's current queue position
- Calling the next customer
- Removing a customer from the queue

## API Endpoints

### POST /api/queue

Adds a new customer to the end of the queue.

Request body:

```json
{
  "name": "Ali"
}