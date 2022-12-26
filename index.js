const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/gameRoutes');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.static('public'));
app.use(cors());

app.use('/game',()=>{console.log("hey let auth")});
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/play',gameRoutes);
app.listen(PORT, () => {
    console.log("app is running on", PORT);
    connectDB();
})