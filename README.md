# PawRescue 

## Overview
PawRescue is a full-stack animal rescue and adoption management platform that helps rescue organizations manage rescued animals, track adoption requests, publish animal updates, and connect animals with potential adopters.

## Project Architecture

PawRescue/
├── frontend/   # React + Vite client
└── backend/    # Node.js + Express API

## Features

### User Features
- User registration and login
- Browse rescued animals
- View detailed animal profiles
- Submit adoption requests
- Save favorite animals
- Track personal adoption requests

### Admin Features
- Dashboard with statistics
- Add, edit, and delete animals
- Manage adoption requests
- Publish animal updates
- Monitor rescue activities

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Main Modules

### Authentication
- User registration
- Login
- JWT-based authorization
- Role-based access control

### Animal Management
- Create animal records
- Update rescue information
- Track adoption status
- View animal details

### Adoption Workflow
- Submit adoption requests
- Review requests
- Approve or reject applications
- Track request status

### Favorites System
- Save animals to favorites
- Remove favorites
- View saved animals

### Updates System
- Publish rescue updates
- View animal progress updates

## Installation

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev


## Environment Variables

### Backend

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

### Frontend

VITE_API_URL=http://localhost:5000/api

## API Modules
- Authentication
- Animals
- Adoption Requests
- Favorites
- Updates
- Dashboard

## Future Enhancements
- Image uploads
- Email notifications
- Shelter management
- Volunteer portal
- Donation system
- AI-based adoption matching
