# 📊 Live Polling System

A real-time polling platform built with **React**, **Express.js**, and **Socket.io**, enabling teachers to create live polls and students to answer them with instant result updates. The system supports configurable poll durations, real-time updates, and a clean UI.

---

## 🚀 Features

### 👨‍🏫 Teacher Features
- **Create a new poll** with multiple options.  
- **View live polling results** in real-time.  
- **Ask a new question** only if:  
  - No question has been asked yet, or  
  - All students have answered the previous question.  
- **View poll history** with all previously asked questions.  
- **Configurable poll time limit** (default 60 seconds).  

### 🧑‍🎓 Student Features
- **Enter name** on first visit (unique to each browser tab).  
- **Submit answers** once a question is asked.  
- **View live results** after submission.  
- **Automatic time limit** of 60 seconds to answer (after which results are shown).  

---

## 🛠 Technology Stack
- **Frontend:** React.js 
- **Backend:** Express.js  
- **Real-time Communication:** Socket.io  
- **Styling:** Tailwind CSS  
- **Hosting:**  
  - Frontend: *Vercel*  
  - Backend: *Render*  

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

1. git clone https://github.com/Amrit-2708/live-polling-system.git

 ### 2️⃣ Run the project

1. Run frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. Server is already hosted or it would run locally on `http://localhost:5000`.

5. Run backend:
    ```bash
    cd server
    npm install
    npm start
