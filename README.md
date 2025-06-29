# Live Polling System

A real-time interactive polling application built with React, Node.js, and Socket.IO that enables teachers to conduct live polls and students to participate in real-time voting sessions.

## Live Deployed URL

https://live-polling-system-culy.onrender.com/

## Video Demo

## Assignment Overview

This project implements a live polling system with two distinct personas (Teacher and Student) as specified in the assignment requirements. The system provides real-time interaction, session management, and comprehensive polling functionality.

## Teacher Features

### Core Requirements Implemented

- **Create New Poll**: Dynamic poll creation with question and multiple choice options
- **View Live Polling Results**: Real-time visualization of student responses with percentage breakdowns

### Good to Have Features

- **Configurable Timer**: Set poll duration (30, 60, or 90 seconds) - exceeds the 60-second requirement
- **Student Management**: Kick out disruptive students with immediate session termination
- **Modern UI Design**: Responsive, intuitive interface built with Tailwind CSS

### Brownie Points Features

- **Chat Popup**: Real-time messaging system for teacher-student interaction
- **Poll History**: Database-stored historical results accessible through dedicated history page

## Technology Stack

### Frontend

- **React**
- **Socket.IO Client**
- **React Router DOM**
- **Tailwind CSS**
- **React Hot Toast**

### Backend

- **Node.js**
- **Express.js**
- **Socket.IO**
- **MongoDB**

## 🚀 Quick Start

```bash
# Backend Setup
cd server
npm install
npm run start:dev

# Frontend Setup
cd client
npm install
npm run start:dev
```

**Environment Configuration**:

_Client_

```env
VITE_NODE_ENV=
VITE_SERVER_URL=
```

_Server_

```env
MONGODB_URI=
PORT=
NODE_ENV=
```
