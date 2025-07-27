# Employee Management System - Backend

This is the backend for the Employee Management System, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Create a `.env` file in the server root directory
   - Add the following environment variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/employee_management
     NODE_ENV=development
     ```

3. **Start the Server**
   - Development (with nodemon):
     ```bash
     npm run server
     ```
   - Production:
     ```bash
     npm start
     ```
   - Development (with frontend):
     ```bash
     npm run dev
     ```

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## Database

MongoDB is used as the database. Make sure MongoDB is installed and running on your system.
