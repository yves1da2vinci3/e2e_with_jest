import express, { Request, Response } from 'express';
import { find } from '../Controller';
const router = express.Router();

router.route('/:username').get(find);

router.route('*').all((req, res) => {
 res.status(404).json({ message: 'Invalid route' });
});

module.exports = router;
