import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.js'
// import { promisify } from 'util'

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]

    if(!token) {
        return res.status(401).json({ msg: '[ERRO] Sem acesso ao banco.', error: true })
    }

    // const decodedd = await promisify(jwt.verify)('fgdsfsdf', authConfig.secret)

    const id = jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) {
            return null
        } 
        return decoded.id
    }) 

    if(!id) {
        return res.status(401).json({ error: true })
    }

    req.userId = id

    return next()
}