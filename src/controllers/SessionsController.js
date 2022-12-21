import jwt from 'jsonwebtoken'

import User from '../models/User'
import { checkPassword } from '../services/auth'
import authConfig from '../config/auth'

class SesseionController {
    async create(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if(!user) {
            return res.status(401).json({ msg: 'Usuário ou senha inválido'})
        }

        const validPassword = await checkPassword(user, password)

        if(!validPassword) {
            return res.status(401).json({ msg: 'Usuário ou senha inválido'})
        }

        const { id, name } = user

        return res.json({
            user: {
                id,
                name,
                email
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }
}

export default new SesseionController();