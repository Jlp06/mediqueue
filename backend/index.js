require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const routes = require("./routes");
const departmentsRoutes = require("./routes/departments");
const countersRoutes = require("./routes/counters");
const tokensRoutes = require("./routes/tokens");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const server = http.createServer(app);

// Allow requests from anywhere (works for Vercel frontend)
app.use(cors());
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
});

// Routes
app.use("/api", routes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/counters", countersRoutes);
app.use("/api/tokens", tokensRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
    res.send("Hospital Queue Backend Running");
});

// IMPORTANT FIX – Use server.listen instead of app.listen
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});