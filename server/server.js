import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.disable('x-powerd-by');
// less hackers know about our stack

const port = 8081;



app.get('/', (req, res) => {
    res.status(201).json("Home get request");
})


/**api routes */
app.use('/api', router)
/**whenever we want to access our route , we specify the api prefix */




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



