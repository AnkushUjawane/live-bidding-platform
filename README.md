# 🔥 Live Bidding Platform

[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/) 
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/) 
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-orange)](https://socket.io/) 
[![License](https://img.shields.io/badge/License-MIT-brightgreen)](LICENSE)

A **real-time auction platform** where users compete to buy items in the final seconds. Includes live countdown timers, instant bid updates, and visual feedback for winning/outbid bids.

---

## 🌐 Demo
[Live Demo](https://your-deployed-link.com)  

![Demo GIF](https://media.giphy.com/media/your-demo.gif)  
*Example of live bidding in action*

---

## ⚡ Features

### Frontend
- Responsive dashboard showing auction items in a grid  
- **Live Countdown Timer** synced with server time  
- **Bid +$10 button** to place bids  
- Visual feedback:
  - 💚 Green flash + "Winning" badge  
  - 🔴 Red flash + "Outbid" state  
- Buttons auto-disable when auction ends  

### Backend
- REST API: `GET /items` → Returns auction items (title, starting price, current bid, end time)  
- Real-time socket events:
  | Event | Description |
  |-------|-------------|
  | `BID_PLACED` | Client submits a bid |
  | `UPDATE_BID` | Server broadcasts new highest bid |
  | `BID_ERROR` | Invalid bid or auction ended |
  | `AUCTION_ENDED` | Auction ended notification |
- Handles **race conditions** using mutex locks  

### Additional
- Optimistic UI updates for instant bid feedback  
- Modular, production-ready code  
- Docker-ready for easy deployment  

---

## 🛠 Tech Stack

| Frontend | Backend | Tools |
|----------|---------|-------|
| React + Vite | Node.js + Express | Socket.io |
| CSS Modules | Mutex for concurrency | Docker |
| Socket.io-client | REST API | GitHub |

---

## 🚀 Installation

### Clone the Repo
```bash
git clone https://github.com/AnkushUjawane/live-bidding-platform.git
cd live-bidding-platform

### Backend Setup
```bash
cd backend
npm install
npm start
# Runs on http://localhost:9000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173

### Using Docker
```bash
docker-compose up --build