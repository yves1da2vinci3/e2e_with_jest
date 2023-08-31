import app from './app';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db'; //Importing the connectDB function
connectDB().catch(err => {
 console.log(err.message);
}); //Calling the connectDB function




const PORT = (process.env.PORT || 5000) as number;

app.listen(PORT, () => {
 console.log('Server is listening on port ' + PORT);
})