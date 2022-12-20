import express from 'express';
import { userRouter } from './routes/userRouter';
import { commentRouter } from './routes/commentRouter';
import { postRouter } from './routes/postRouter';
import bodyParser from 'body-parser';
import { authRouter } from './middlewares/handleauth';
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
import cors from 'cors';

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// handlebars middleware
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(cors({
    origin:'*',
    credentials:true
}));
app.use('/', authRouter);
app.use('/Users', userRouter);
app.use('/Posts', postRouter);
app.use('/Comments', commentRouter);

// Set static folder
app.use(express.static('views'));

app.use('/', (req, res) => {
    //res.cookie('token', 'test', {signed: true});
    res.render('index')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));