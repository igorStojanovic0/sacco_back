import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
import express from 'express';
import Database from './services/Database';
import ExpressServer from './services/ExpressServer';
var path = require("path");
const cors = require("cors");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const StartServer = async () => {
    
    const app = express();
    const corsOptions = {
        origin: '*',
      };
    app.use(cors(corsOptions))
    app.options('*', cors(corsOptions));

    app.use('/api/v1',express.static(path.join(__dirname, "uploads")));


    await Database();
    await ExpressServer(app);

    app.listen(3001, () => console.log('Server is running on port 3001'));
};

StartServer();