import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import contactRoute from './routes/Contactroute.js'

const app = express();

dotenv.config({ path: "./config/.env" });

app.use(cors({
  origin: process.env.CLIENT_URL || "https://lutfi-portfolio-two.vercel.app",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.use('/api/contact', contactRoute);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running.' });
});

const connectDB = async () => {
  if (!process.env.MONGO_URI) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();