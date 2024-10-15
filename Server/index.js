import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from "socket.io";




const app = express();
// Thiết lập server cho WebSocket
const server = http.createServer(app);
const io = new Server(server, { 
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);
app.use(express.static('Public'));
app.use('/uploads', express.static('uploads')); // Static file serving

// Xác thực user đã đăng nhập vào website chưa
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// Thiết lập các giao thức gửi, nhận tin nhắn của socket
io.on('connection', (socket) => {
    console.log('Kết nối employee thành công');

    socket.on('send_message',(data) => {
        console.log('receive message',data);
        io.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Ngắt kết nối employee');
    });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
