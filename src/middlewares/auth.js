import jwt from 'jsonwebtoken'
import authConfig from '../config/auth'
import { promisify } from 'util'
import User from '../models/User';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]
    const email = authHeader?.split(' ')[2]

    if(!authHeader) {
        return res.status(401).json({ msg: 'Token não fornecido 1'})
    }

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret)
        
        req.userId = decoded.id

    } catch(err) {
        return res.status(401).json({ msg: 'Token inválido.' })
    }

    try{
        const { _id } = await User.findOne({ email, token });
        
        if(_id){
            return next()
        }

        return res.status(401).json({ msg: 'Token não confere com usuário.'})
    } catch(err){
        return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao validar token.', err})
    }
}