import { connect } from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const MONGO_URI = process.env.MONGO_URI as string; //Getting the URI from .env file

export async function connectDB() {
 await connect(MONGO_URI); //Connecting to the database
 console.log('Database is connected successfully');
}
const TESTING_MONGO_URI = process.env.TESTING_MONGO_URI as string;
export async function testDB() {
    await connect(TESTING_MONGO_URI);
 }