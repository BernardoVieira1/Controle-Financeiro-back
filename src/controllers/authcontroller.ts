import { Request, Response } from 'express';
import { prisma } from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

export default {
	async loginUser(req: Request, res: Response) {
		try {
			const { email, password } = req.body;


			if (!email || !password) {
				return res.status(400).json({ message: 'preencha todos os campos!' });
			}

			const user = await prisma.user.findMany({
				where: {
					email: email
				}
			});


			if (user.length != 1) {
				return res.status(404).json({ message: 'Usuario não está cadastrado!' });
			}

			const checkPassword = await bcrypt.compare(password, user[0].password);

			if (!checkPassword) {
				return res.status(400).json({
					message: 'Senha incorreta',
					checkPassword
				});

			}

			const secret = process.env.SECRET;
			const token = jwt.sign({ id: user[0].id }, secret);

			res.status(201).json({
				message: 'usuario logado com sucesso!',
				token
			});

		} catch (err) {
			res.json({ message: err.message });
		}
	},

};