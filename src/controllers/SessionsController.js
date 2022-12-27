import jwt from 'jsonwebtoken'

import User from '../models/User'
import { checkPassword } from '../services/auth'
import authConfig from '../config/auth'

import { promisify } from 'util'

class SesseionController {
    async create(req, res) {
        const { email, password } = req.body

        if(!email) {
            return res.status(401).json({ msg: 'Informe um e-mail.'})
        }

        if(!password) {
            return res.status(401).json({ msg: 'Informe uma senha.'})
        }

        const user = await User.findOne({ email })
        
        if(!user) {
            return res.status(401).json({ msg: 'Usuário ou senha inválido'})
        }

        const validPassword = await checkPassword(user, password)

        if(!validPassword) {
            return res.status(401).json({ msg: 'Usuário ou senha inválido'})
        }

        const { id, name } = user

        const token = jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
        })

        await user.updateOne({ token })

        return res.json({
            user: {
                id,
                name,
                email
            },
            token
        })
    }

    async validUser(req, res){
        const { token, email } = req.params

        try {

            if(!token && !email){
                return res.status(401).json({ msg: 'Dados não fornecidos'})
            }
    
            try {
                await promisify(jwt.verify)(token, authConfig.secret)
            } catch {
                return res.status(401).json({ msg: 'Token inválido', error: true})
            }
            
            const { id, name } = await User.findOne({ email, token}, '-password') // 
    
            if(!id){
                return res.status(401).json({ msg: 'Usuário não econtrado'})
            }

            return res.status(200).json({
                id,
                name,
                email
            })
            
        }catch {
            return res.status(401).json({ msg: '[ERRO]: Erro ao validar usuário!!', error: true})
        }
    }

    async logout(req, res){
        const { token, email } = req.params

        try {

            if(!token && !email){
                return res.status(401).json({ msg: 'Dados não fornecidos.'})
            }
    
            try {
                await promisify(jwt.verify)(token, authConfig.secret)
            } catch {
                return res.status(401).json({ msg: 'Token inválido', error: true})
            }
            
            const user = await User.findOne({ email, token}, '-password') // 
    
            if(!user){
                return res.status(401).json({ msg: 'Usuário não econtrado'})
            }

            await user.updateOne({ token: null })

            return res.status(200).json({ msg: 'sessão finalizada' })

        }catch {
            return res.status(401).json({ msg: '[ERRO]: Erro ao finalizar sessão!!', error: true})
        }
    }
}

export default new SesseionController();