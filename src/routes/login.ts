import express, { Request, Response } from 'express';
import { login } from '../Controller';
const router = express.Router();

router.route('/').post(login);

router.route('*').all((req, res) => {
 res.status(404).json({ message: 'Invalid route' });
});

module.exports = router