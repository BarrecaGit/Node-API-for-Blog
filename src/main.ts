import express from 'express';
import { userRouter } from './routes/userRouter';
import { commentRouter } from './routes/commentRouter';
import { postRouter } from './routes/postRouter';
import bodyParser from 'body-parser';
import { authRouter } from './middlewares/handleauth';
const path = require('path');
import fs from 'fs';
const app = express();
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';


let swagger_doc = fs.readFileSync(path.join(process.cwd(),'src','openapi.json'));
let swagger_obj = JSON.parse(swagger_doc.toString());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin:'*',
    credentials:true
}));
app.use('/', authRouter);
app.use('/Users', userRouter);
app.use('/Posts', postRouter);
app.use('/Comments', commentRouter);

app.use('/', swaggerUI.serve, swaggerUI.setup(swagger_obj));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));