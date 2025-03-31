# Froggie Five-O Project

A safety escort service application for TCU (Texas Christian University) campus. This app helps students, faculty, and staff request safe rides around campus.

## Project Overview

Froggie Five-O is a React-based web application with a Node.js/Express backend, using MongoDB for data storage. The application provides:

- User authentication (riders, drivers, dispatchers)
- Real-time ride requests and tracking
- Driver and cart management
- Interactive maps showing pickup, dropoff, and driver locations

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Google Maps API for location services

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Socket.io for real-time updates (planned)

## Features

- **Multi-role Authentication**: Login and registration for riders (students), drivers, and dispatchers
- **Ride Requests**: Students can request rides with pickup and dropoff locations
- **Real-time Tracking**: Tracking of rides and driver locations on Google Maps
- **Driver Dashboard**: Drivers can manage their status and view/accept rides
- **Dispatcher Dashboard**: Dispatchers can manage all rides, drivers, and carts

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB
- NPM or Yarn
- Google Maps API key

### Installation

1. Clone the repository:
```
git clone https://github.com/IyedAcheche/froggie-five-o-project.git
cd froggie-five-o-project
```

2. Install dependencies for both client and server:
```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the client directory with your Google Maps API key:
     ```
     REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     REACT_APP_API_BASE_URL=http://localhost:5000/api
     ```
   - Create a `.env` file in the server directory:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/froggie_five_o
     JWT_SECRET=your_jwt_secret_key
     ```

4. Start the development servers:
```
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

## Usage

- Open your browser and navigate to `http://localhost:3000`
- Register as a new user (rider, driver, or dispatcher)
- Use the application based on your role:
  - Riders: Request rides, view ride history
  - Drivers: Accept ride requests, manage your status
  - Dispatchers: Manage all rides, drivers, and carts

## Project Structure

```
froggie-five-o-project/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── pages/          # Page components
│       └── types/          # TypeScript type definitions
├── server/                 # Node.js backend
│   ├── src/                # Source files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
└── README.md               # Project documentation
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- TCU for the inspiration
- Material-UI for the component library
- Google Maps for the mapping functionality 