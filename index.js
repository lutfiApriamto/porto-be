import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({ path: "./config/.env" });

app.use(cors({
    origin: "https://lutfi-portfolio-two.vercel.app/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());