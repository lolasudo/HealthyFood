require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router=require('./router/index')


const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api',router);

const start = async () => {  
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 5000 // Таймаут подключения (5 сек)
        });
        console.log("Connected to MongoDB!");

        app.listen(PORT, () => console.log(`Server started on Port=${PORT}`));

    } catch (e) {
        console.error("Error connecting to MongoDB:", e.message);
    }
};

// Запуск сервера
start();
