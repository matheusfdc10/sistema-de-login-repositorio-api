import User from '../models/User.js'
import { createPasswordHash } from '../services/auth.js';
import { checkPassword } from '../services/auth.js'
import jwt from 'jsonwebtoken'
import authConfig from '../config/authUpdateUser.js'
import { promisify } from 'util'

class UserController {
    async index(req, res) {
        try {
            const users = await User.find();
            return res.json(users)
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar listar usuários.', error})
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params

            if(!id) {
                return res.status(404).json({ msg: 'Usuário não informado.'})
            }

            const user = await User.findById(id, '-password');

            if(!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado.'})
            }

            return res.json(user)
           
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar pegar usuário.', error})
        }
    }

    async create(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;

            if(!name) {
                return res.status(422).json({ msg: `Informe seu nome.`});
            }

            if(!email) {
                return res.status(422).json({ msg: `Informe um e-mail.`});
            }

            if(!password) {
                return res.status(422).json({ msg: `Informe uma senha.`});
            }

            if(password !== confirmPassword){
                return res.status(422).json({ msg: `Senhas não conferem.`});
            }

            const user = await User.findOne({ email });
            
            if(user) {
                return res.status(422).json({ msg: `E-mail ( ${email} ) já cadastrado!`});
            }

            const encreatePasswordHash = await createPasswordHash(password)

            await User.create({ 
                name, 
                email, 
                password: encreatePasswordHash,        
            });

            return res.status(201).json();
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar criar uma conta.', error})
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { name, email, password } = req.body

            if(!name) {
                return res.status(422).json({ msg: `Informe seu novo nome.`});
            }

            if(!email) {
                return res.status(422).json({ msg: `Informe seu novo e-mail.`});
            }

            if(!password) {
                return res.status(422).json({ msg: `Informe sua nova senha.`});
            }

            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado.'})
            }

            const encreatePasswordHash = await createPasswordHash(password)

            await user.updateOne({ name, email, password: encreatePasswordHash})

            return res.status(200).json();
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar atualizar usuário.', error})
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params
            
            if(!id) {
                return res.status(404).json({ msg: 'Usuário não informado.'})
            }

            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado.'})
            }

            await user.delete()

            return res.status(200).json({ msg: 'Usuário excluido com sucesso.'});
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar excluir usuário.', error})
        }
    }

    async getUser(req, res){
        try {
            const id = req.userId

            if(!id) {
                return res.status(401).json({ msg: 'Sessão expirada', error: true})
            }

            const user = await User.findOne({ _id: id}, '-password') // 
            
            if(!user){
                return res.status(401).json({ msg: 'Usuário não econtrado'})
            }

            return res.status(200).json({
                name: user.name
            })
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar encontrar usuário.', error})
        }   
    }

    async checkPassword(req, res) {
        try {
            const id = req.userId
            const { password } = req.body;

            if(!password) {
                return res.status(404).json({ msg: 'Informe sua senha.'})
            }

            if(!id) {
                return res.status(404).json({ msg: 'Usuário não informado.'})
            }

            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado.'})
            }

            const checkeUser = await User.findOne({ 
                _id: id
            })

            if(!checkeUser) {
                return res.status(401).json({ msg: 'Usuário não confere.'})
            }

            const validPassword = await checkPassword(user, password)

            if(!validPassword) {
                return res.status(401).json({ msg: 'Senha incorreta.'})
            }

            const { _id, email } = user
    
            return res.status(200).json({
                auth: true,
                token: jwt.sign({ id: _id, email}, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                })
            })

        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao confirmar senha.', error})
        }
    }

    async updatePassword(req, res) {
        try {
            const id = req.userId
            const { token } = req.params
            const { password, confirmPassword } = req.body

            if(!token) {
                return res.status(401).json({ msg: 'Token não fornecido'})
            }
            
            try {
                const resp = await promisify(jwt.verify)(token, authConfig.secret)
                if(resp.id !== id) {
                    return res.status(401).json({ msg: 'Tente novamente', error: true})
                }
            } catch {
                return res.status(401).json({ msg: 'Token inválido', error: true})
            }

            if(!password){
                return res.status(404).json({ msg: 'Informe uma senha.'})
            }

            if(!confirmPassword){
                return res.status(404).json({ msg: 'Informe uma confimação de senha.'})
            }

            if(password !== confirmPassword){
                return res.status(404).json({ msg: 'Senha não confere.'})
            }

            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado.'})
            }

            const encreatePasswordHash = await createPasswordHash(password)

            await user.updateOne({ password: encreatePasswordHash })

            return res.status(200).json({ msg: 'Senha alterada com sucesso.'});
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]: Aconteceu um erro ao tentar alterar senha.', error});
        }
    }
}

export default new UserController();