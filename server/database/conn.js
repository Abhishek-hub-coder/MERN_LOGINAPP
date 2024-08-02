import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from '../config.js'
async function connect() {
    const mongod = await MongoMemoryServer.create();
    // this is going to create a new mongod instance , whenever we start our server
    // and you have the mongod URL inside this mongod variable , and to get that 
    // the url is inside the gtUri variable
    const getUri = mongod.getUri();
    // inside this geturi, you are going to have mongo db url

    mongoose.set('strictQuery', true);

    // const db = await mongoose.connect(getUri);
    //  
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log("Database connected");
    return db;

}

export default connect;


