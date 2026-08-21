require('dotenv').config();

const app = require('./server/app');

// Connect Database
// connectDB();

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
