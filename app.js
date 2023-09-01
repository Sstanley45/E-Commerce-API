import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import fileUpload from "express-fileupload";
import connectDB from './db/connect.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFound from './middleware/not-found.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import reviewRouter from './routes/reviewRoutes.js';



const port = process.env.PORT || 5000;

app.use(morgan('tiny')) 
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

//make that public folder available ie set it up as a static asset
app.use(express.static('./public')) //once we upload the image we want the url to point to our server another option is setting it up on the cloudinary  
app.use(fileUpload())


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter); 
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);

app.get('/', (req, res) => {
    res.status(200).send('E-Commerce API')
})
app.get("/api/v1", (req, res) => {
    console.log(req.signedCookies);
  res.status(200).send("E-Commerce API modified");
});
 

app.use(notFound);
app.use(errorHandlerMiddleware);



const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('connected to local mongoDB');
        app.listen(port, console.log(`server listening on port ${port} `))
    } catch (error) {
        console.log('server error',error);
    }
}

start()
