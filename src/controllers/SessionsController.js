import jwt from 'jsonwebtoken'
import User from '../models/User'
import { checkPassword } from '../services/auth'
import authConfig from '../config/auth'
import { promisify } from 'util'

class SesseionController {
    async create(req, res) {
        try {
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

            const { id } = user

            const token = jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })

            return res.json({
                token
            })
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao iniciar sessão.', error})
        }
    }
}

export default new SesseionController();