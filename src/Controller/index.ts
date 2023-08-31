import { Request, Response } from 'express';
import Account from '../model/Account';

// @right PRIVATE
// endpoint api/users/deposit
// @desc make deposit to a  specific account
export const deposit = async (req: Request, res: Response) => {
    const {
      username,
      password,
      amount
    }: { username: string; password: string; amount: number } = req.body; //Getting the username, password and amount from the request body
   
    if (!username || !password || !amount || amount <= 0) {
      //Checking if the username, password or amount is missing in the request body
      return res.status(400).json({ message: 'Missing parameters' });
    }
    try {
      const lowerUsername = username.toLowerCase(); //Converting the username to lowercase
      const checkUsername: any = await Account.findOne({
        username: lowerUsername
      });
      if (!checkUsername) {
        //Checking if the username exists in the database
        return res
          .status(400)
          .json({ message: 'Username or password is incorrect' });
      }
      if (checkUsername.password !== password) {
        //Checking if the password is correct
        return res
          .status(400)
          .json({ message: 'Username or password is incorrect' });
      }
      const newAmount: number = parseInt(amount as any) + checkUsername.balance; //Calculating the new balance
      await Account.updateOne(
        //Updating the balance in the database
        { username: lowerUsername },
        { balance: newAmount }
      );
      return res.status(201).json({ message: 'Deposit successful' });
    } catch (error: any) {
      console.log(error.message); //Logging the error message if any
      return res.status(500).json({ message: 'Error depositing funds' });
    }
   };
   // @right PRIVATE
// endpoint api/users/find
// @desc find a specific  account
export const find = async (req: Request, res: Response) => {
    const { username }: { username: string } = req.params as any; //Getting the username from the request parameters
   
    if (!username) {
      //Checking if the username is missing in the request parameters
      return res.status(400).json({ message: 'Missing parameters' });
    }
   
    try {
      const lowerUsername = username.toLowerCase(); //Converting the username to lowercase
      const checkUsername: any = await Account.findOne({
        username: lowerUsername
      });
      if (!checkUsername) {
        //Checking if the username exists in the database
        return res.status(400).json({ message: 'Username not found' });
      }
      const response = {
        //Creating the response object with the username and balance
        username: checkUsername.username,
        balance: checkUsername.balance
      };
      return res.status(200).json({ user: response });
    } catch (error: any) {
      console.log(error.message); //Logging the error message if any
      return res.status(500).json({ message: 'Error finding user' });
    }
   };
// @right PRIVATE
// endpoint api/users/transfer
// @desc make transfer from one user to another
export const transfer = async (req: Request, res: Response) => {
    const {
      username,
      recipient,
      password,
      amount
    }: {
      username: string;
      password: string;
      recipient: string;
      amount: number;
    } = req.body; //Getting the username, password, recipient and amount from the request body
   
    if (!username || !password || !recipient || !amount || amount <= 0) {
      //Checking if the username, password, recipient or amount is missing in the request body
      return res.status(400).json({ message: 'Missing parameters' });
    }
   
    try {
      const lowerUsername = username.toLowerCase();
      const lowerrecipient = recipient.toLowerCase(); //Converting the username and recipient to lowercase
      if (lowerUsername === lowerrecipient) {
        //Checking if the username and recipient are the same
        return res.status(400).json({ message: 'Cannot transfer to self' });
      }
      const checkUsername: any = await Account.findOne({
        username: lowerUsername
      });
      if (!checkUsername) {
        //Checking if the username exists in the database
        return res
          .status(400)
          .json({ message: 'Username or password is incorrect' });
      }
      if (checkUsername.password !== password) {
        //Checking if the password is correct
        return res
          .status(400)
          .json({ message: 'Username or password is incorrect' });
      }
      if (checkUsername.balance < amount) {
        //Checking if the user has sufficient funds
        return res.status(400).json({ message: 'Insufficient funds' });
      }
      const checkrecipient: any = await Account.findOne({
        username: lowerrecipient
      });
      if (!checkrecipient) {
        //Checking if the recipient exists in the database
        return res.status(400).json({ message: 'recipient not found' });
      }
      const newAmount: number = checkUsername.balance - parseInt(amount as any); //Calculating the new balance for the user
      await Account.updateOne(
        { username: lowerUsername },
        { balance: newAmount }
      );
      const newAmount2: number = checkrecipient.balance + parseInt(amount as any); //Calculating the new balance for the recipient
      await Account.updateOne(
        { username: lowerrecipient },
        { balance: newAmount2 }
      );
      return res.status(201).json({ message: 'Transfer successful' });
    } catch (error: any) {
      console.log(error.message);
      return res.status(500).json({ message: 'Error transferring funds' });
    }
   };

// @right PUBLIC
// endpoint api/users/login
// @desc Login to the platform
export const login = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } =
      req.body; //Getting the username and password from the request body
   
    if (!username || !password) {
      //Checking if the username or password is missing in the request body
      return res
        .status(400)
        .json({ message: 'Username or password not provided' });
    }
   
    try {
      const lowerUsername = username.toLowerCase(); //Converting the username to lowercase
      const checkUsername = await Account.findOne({ username: lowerUsername });
      if (!checkUsername) {
        //Checking if the username exists in the database
        return res
          .status(400)
          .json({ message: 'Username or password is incorrect' });
      }
      if (checkUsername.password !== password) {
        //Checking if the password is correct
        return res
          .status(400)
          .json({ message: 'Username or password is incorrect' });
      }
      return res.status(200).json({ message: 'Login successful' });
    } catch (error: any) {
      console.log(error.message); //Logging the error message if any
      return res.status(500).json({ message: 'Error logging in' });
    }
   };

// @right PUBLIC
// endpoint api/users/signup
// @desc signup to the platform
export const signup = async (req: Request, res: Response) => {
    const { username, password }: { username: string; password: string } =
      req.body; //Getting the username and password from the request body
   
    if (!username || !password) {
      //Checking if the username or password is missing in the request body
      return res
        .status(400)
        .json({ message: 'Username or password not provided' });
    }
   
    try {
      const lowerUsername = username.toLowerCase(); //Converting the username to lowercase
      const checkUsername: any = await Account.findOne({
        username: lowerUsername
      });
      if (password.length < 8) {
        //Checking if the password is at least eight characters long
        return res
          .status(400)
          .json({ message: 'Password must be at least 8 characters long' });
      }
      if (checkUsername) {
        //Checking if the username already exists
        return res.status(400).json({ message: 'Username already taken' });
      }
      const account = new Account({
        //Creating a new account
        username: lowerUsername,
        password,
        balance: 0
      });
      await account.save(); //Saving the account to the database
      return res.status(201).json({ message: 'Account created' });
    } catch (error: any) {
      console.log(error.message); //Logging the error message if any
      return res.status(500).json({ message: 'Error creating account' });
    }
   };