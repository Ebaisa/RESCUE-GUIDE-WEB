# RESCUE GUIDE MOBILE APP

This is the website  for that enhance Emergency Response.  It provides a user interface for hospitals to manage SOS alerts and emergency situations.

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Setup

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd eba-frontend-js
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Features

- Hospital Registration and Login
- Hospital Dashboard
- Admin Dashboard
- SOS ALERT Management
- Emergency Service Requests
- Responsive Design




```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  │   └── layout/    # Layout components (Navbar, Footer)
  ├── context/       # React Context providers
  ├── pages/         # Page components
  ├── services/      # API services
  └── App.jsx        # Main application component
```

## Technologies Used

- React 18
- Chakra UI
- React Router
- Axios
- Vite 
