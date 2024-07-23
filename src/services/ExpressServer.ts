import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import ErrorHandlerMiddleware from '../middlewares/ErrorHandler';
import productRouter from '../routes/application.routes';
import groupChannelRouter from '../routes/channel.routes';
import groupRouter from '../routes/group.routes';
import groupChatRouter from '../routes/groupChat.routes';
import groupUserFriendRouter from '../routes/groupUserFriend.routes';
import roleRouter from '../routes/role.routes';
import saccoRouter from '../routes/sacco.routes';
import userRouter from '../routes/user.routes';

export default async (app: Application) => {
    app.use(express.json());
    
    const multer = require('multer');
    const upload = multer({ dest: 'src/uploads/' });
    app.use(cors({
        origin: [process.env.CLIENT_URL as string],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }));

    app.get("/health", async(req: Request, res: Response ) => {
        res.send({
            message: "Health OK!"
        });
    });
//Photograph upload
    app.post('/file', upload.single('file'), (req, res) => {
        // Access uploaded file via req.file
        res.send({ fileName: req?.file?.filename });
    });
//IDphoto upload
    app.post('/IDPhoto', upload.single('file'), (req, res) => {
        // Access uploaded file via req.file
        res.send({ fileName: req?.file?.filename });
    });

    app.use('/api/v1/auth', userRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/role', roleRouter);
    app.use('/api/v1/group', groupRouter);
    app.use('/api/v1/groupChannel', groupChannelRouter);
    app.use('/api/v1/groupChat', groupChatRouter);
    app.use('/api/v1/groupUserFriend', groupUserFriendRouter);

    app.use('/api/v1/sacco', saccoRouter);

    app.use(ErrorHandlerMiddleware);

    return app;
}