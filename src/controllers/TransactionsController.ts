import { Request, Response } from 'express';
import { prisma } from '../database';
import { JwtPayload } from 'jsonwebtoken';

interface customRequest extends Request {
    userId:string | JwtPayload;
}

export default{

	async createTransaction(req: customRequest, res: Response){
		try{
			const authUserId = req.userId;
			const userId = String(authUserId);

			const {title, value, type, categoria} = req.body;

			if(!userId){
				return res.status(400).json({message: 'Usuario não informado'});
			}

			if(!title){
				return res.status(400).json({message: 'Titulo não informado'});
			}

			if(!value){
				return res.status(400).json({message: 'valor não informado'});
			}

			if(!type){
				return res.status(400).json({message: 'tipo não informado'});
			}

			if(!categoria){
				return res.status(400).json({message: 'categoria não informado'});
			}

			const transaction = await prisma.transactions.create({
				data:{
					userId,
					title,
					value,
					type,
					categoria,
				}
			});

			return res.status(201).json({
				err: false,
				message: 'transaction criada com sucesso',
				transaction
			});

		} catch (err) {
			return res.json({ message: err.message });
		}
	},

	async getTransactions(req: Request, res: Response){
		try {
			const transactions = await prisma.transactions.findMany();

			res.json({
				err: false,
				message: 'Lista com todas as transactions',
				transactions

			});
		} catch (err) {
			return res.json({ message: err.message });
		}
	},

	async searchTransactions(req: Request, res: Response){
		try {
			const { search } = req.body;

			const transactions = await prisma.transactions.findMany({
				where:{
					title: {
						contains: search
					}
				}
			});

			res.json({
				err: false,
				message: 'Lista com todas as transactions',
				transactions

			});
		} catch (err) {
			return res.json({ message: err.message });
		}
	},

	async getTransaction(req: Request, res: Response){
		try {
			const transaction = await prisma.transactions.findMany({
				where:{
					id: req.params.id
				}
			});

			if(transaction.length == 0){
				return res.status(400).json({message: 'Operação não encontrada'});

			}

			res.json({
				err: false,
				transaction

			});

		} catch (err) {
			return res.json({ message: err.message });
		}
	},

	async getMyTransactions(req: customRequest, res: Response){
		try {
			const authUserId = req.userId;
			const userId = String(authUserId);

			const transactions = await prisma.transactions.findMany({
				where:{
					userId: userId
				}
			});

			if(transactions.length == 0){
				return res.status(200).json({message: 'Você não tem operações'});

			}

			res.json({
				err: false,
				transactions

			});

		} catch (err) {
			return res.json({ message: err.message });
		}
	},

	async deleteTransaction(req: Request, res: Response){
		try {

			const transactionExists = await prisma.transactions.findMany({
				where:{
					id: req.params.id
				}
			});

			if(transactionExists.length == 0){
				return res.status(400).json({message: 'Operação não encontrada'});

			}

			const DeletTransaction = await prisma.transactions.delete({
				where:{
					id: req.params.id
				}

			});

			res.json({
				err: false,
				message: 'deletado com sucesso',
				DeletTransaction
			});

		} catch (err) {
			res.json({ message: err.message });
		}
	}

};