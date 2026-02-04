require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const departmentsRoutes = require("./routes/departments");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const countersRoutes = require("./routes/counters");
const tokensRoutes = require("./routes/tokens");
const analyticsRoutes = require("./routes/analytics");


app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
app.set("io", io); // make io accessible in routes

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
});

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Hospital Queue Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

app.use("/api/departments", departmentsRoutes);
app.use("/api/counters", countersRoutes);
app.use("/api/tokens", tokensRoutes);
app.use("/api/analytics", analyticsRoutes);