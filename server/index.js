const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Data store (in-memory for demo)
let currentQuestion = null;
let answers = {};
let studentsAnswered = 0;
let totalStudents = 0;
let participants = []; // 👈 Track all connected students

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('get-participants', () => {
        // Sends the current participant list back to the client that requested it.
        socket.emit('update-participants', participants.map(p => p.name));
    });

    // Student registers
    socket.on('register-student', (name) => {
        socket.data.name = name;
        totalStudents++;

        // Add to participants list
        participants.push({ id: socket.id, name });

        console.log(`${name} joined! Total students: ${totalStudents}`);

        // Emit updated participants list to all
        io.emit('update-participants', participants.map(p => p.name));
    });

    // Teacher asks new question
    socket.on('ask-question', (questionData) => {
        currentQuestion = questionData;
        answers = {};
        studentsAnswered = 0;

        io.emit('new-question', questionData); // Broadcast to all students
    });

    // Student submits answer
    socket.on('submit-answer', (answer) => {
        answers[socket.data.name] = answer;
        studentsAnswered++;
        console.log(`Answer received: ${socket.data.name} -> ${answer}`);

        // Broadcast live results
        const result = getPollResults();
        io.emit('poll-update', result);

        // If all answered, notify teacher
        if (studentsAnswered === totalStudents) {
            io.emit('all-answered', result);
        }
    });

    // Student sends a chat message
    socket.on('chat-message', (msg) => {
        const sender = socket.data.name || 'Anonymous';

        // Broadcast to all including sender
        io.emit('chat-message', {
            sender,
            message: msg,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('kick-student', (studentNameToKick) => {
        const studentToKick = participants.find(p => p.name === studentNameToKick);

        if (studentToKick) {
            const studentSocket = io.sockets.sockets.get(studentToKick.id);
            if (studentSocket) {
                // 1. Notify the student they are being kicked
                studentSocket.emit('you-have-been-kicked');

                // 2. Disconnect them after a brief moment to ensure the message is delivered
                setTimeout(() => {
                    studentSocket.disconnect(true);
                    console.log(`Kicked out student: ${studentNameToKick}`);
                }, 500); // 0.5-second delay
            }
        }
    });

    socket.on('disconnect', () => {
        const wasParticipant = participants.find(p => p.id === socket.id);
        if (wasParticipant) {
            participants = participants.filter(p => p.id !== socket.id);
            io.emit('update-participants', participants.map(p => p.name));
            console.log(`${wasParticipant.name} left or was kicked.`);
        }
    });
});

function getPollResults() {
    const counts = {};
    Object.values(answers).forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
    });
    return counts;
}

// const PORT = 5000;
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
