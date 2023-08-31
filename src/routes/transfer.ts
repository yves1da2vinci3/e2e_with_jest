import express, { Request, Response } from 'express';
import { transfer } from '../Controller';
const router = express.Router();

router.route('/').put(transfer);

router.route('*').all((req, res) => {
 res.status(404).json({ message: 'Invalid route' });
});

module.exports = router;