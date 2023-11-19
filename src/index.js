const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { createProxyMiddleware } = require('http-proxy-middleware');
const { PORT, BOOKING_SERVICE_URL, AUTH_SERVICE_URL } = require('./config/serverConfig');
const axios = require('axios');


const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})


const setupAndStartServer = async () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(morgan('combined'));
    app.use(limiter);
    app.use('/bookingservice', async (req,res,next) => {
        try {
            const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/isAuthenticated`, {
                headers: {
                    'x-access-token': req.headers['x-access-token']
                }
            });
            console.log(response.data);
            if(response.data.success){
                next();
            }
            else {
                return res.status(401).json({
                    message: 'UnAuthorized'
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'UnAuthorized'
            });
        }
    });
    app.use('/bookingservice', createProxyMiddleware({target: BOOKING_SERVICE_URL, changeOrigin: true}));

    app.get('/home', (req,res) => {
        res.json({
            message: 'OK'
        });
    })

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}

setupAndStartServer();