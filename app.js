const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user_route');
dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.end();
});

app.use('/', userRoutes);
connectDB().then(() => {
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

  server.on('error', (err) => {
    console.error(err.message);
    process.exit(1);
  });
});