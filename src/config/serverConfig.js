require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL
}