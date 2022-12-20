"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./routes/userRouter");
const commentRouter_1 = require("./routes/commentRouter");
const postRouter_1 = require("./routes/postRouter");
const handleauth_1 = require("./middlewares/handleauth");
const path = require('path');
const app = (0, express_1.default)();
const exphbs = require('express-handlebars');
const cors_1 = __importDefault(require("cors"));
// Body Parser Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// handlebars middleware
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use('/', handleauth_1.authRouter);
app.use('/Users', userRouter_1.userRouter);
app.use('/Posts', postRouter_1.postRouter);
app.use('/Comments', commentRouter_1.commentRouter);
// Set static folder
app.use(express_1.default.static('views'));
app.use('/', (req, res) => {
    //res.cookie('token', 'test', {signed: true});
    res.render('index');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
