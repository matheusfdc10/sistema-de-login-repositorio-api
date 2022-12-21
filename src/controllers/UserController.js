import User from '../models/User'
import { createPasswordHash } from '../services/auth';

class UserController {
    async index(req, res) {
        try {
            const users = await User.find();
            return res.json(users)
        } catch(error) {
            return res.status(500).json({ msg: 'Erro', error})
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params
            const user = await User.findById(id, '-password');

            if(!user) {
                return res.status(404).json({ msg: '[ERRO]:'})
            }

            return res.json(user)
           
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]:', error})
        }
    }

    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await User.findOne({ email });

            if(user) {
                return res.status(422).json({ msg: `E-mail (${email}) já cadastrado!`});
            }

            const encreatePasswordHash = await createPasswordHash(password)

            const newUser = await User.create( { name, email, password: encreatePasswordHash});

            return res.status(201).json(newUser);
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]:', error})
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { name, email, password } = req.body

            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg: '[ERRO]:'})
            }

            const encreatePasswordHash = await createPasswordHash(password)

            await user.updateOne({ name, email, password: encreatePasswordHash})

            return res.status(200).json();
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]:', error})
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params
            const user = await User.findById(id);

            if(!user) {
                return res.status(404).json({ msg: '[ERRO]:'})
            }

            await user.delete()

            return res.status(200).json();
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]:', error})
        }
    }
}

export default new UserController();