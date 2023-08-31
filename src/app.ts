import express from 'express';
   
const app = express();
app.use(express.json());
   
//Routes
app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/transfer', require('./routes/transfer'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/find', require('./routes/find'));
   
export default app;