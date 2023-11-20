import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface customRequest extends Request {
    userId: string | JwtPayload;
}

function checkAuth(req: customRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado' });
    }
    try {

        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.userId = decoded.id;

        next();

    } catch (err) {
        return res.status(400).json({ msg: 'Token inválido' });
    }
}

export default checkAuth;