import { Request, Response } from 'express';
import { prisma } from '../database';
import { JwtPayload } from 'jsonwebtoken';

interface customRequest extends Request {
    userId:string | JwtPayload;
}

export default{
	async getValuesTransactions(req: customRequest, res: Response){
		const authUserId = req.userId;
		const userId = String(authUserId);
		try {
			let entryPrice = 0;
			let exitPrice = 0;

			const transactions = await prisma.transactions.findMany({
				where:{
					userId: userId
				},
				select:{
					value: true,
					type: true,
					dateCreate: true,
				}
			});

			transactions.forEach(transaction =>{
				if(transaction.type === 'ENTRADA'){
					entryPrice = entryPrice + Number(transaction.value);

				}else{
					exitPrice =exitPrice + Number(transaction.value);
				}

			});

			res.json({
				entrada: Number(entryPrice),
				saida: Number(exitPrice),
				total: Number(entryPrice-exitPrice)
			});

		} catch (err) {

			return res.json({ message: err.message });
		}
	}


};





