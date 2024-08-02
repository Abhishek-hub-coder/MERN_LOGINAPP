import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
const app = express();
// this is going to create a simple express application.
/**middwware */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
// it is going to specify the tiny format
app.disable('x-powerd-by');
// less hackers know about our stack

const port = 8081;

// making HTTP get request
// making get request on the route route
app.get('/', (req, res) => {
    res.status(201).json("Home get request");
})


/**api routes */
app.use('/api', router)
/**whenever we want to access our route , we specify the api prefix */















/** start server only , when we have a valid connection */
/** we are getting successful promise inode the get function other iside catch function */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    }
    catch (error) {
        console.log('Cannot connected to the server');

    }
}).catch(error => {
    console.log("invalid database connection")
})
/** start server */
// first call app.listen and then call the handler function inside the 

