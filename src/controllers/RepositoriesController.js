import User from "../models/User"
import Repository from "../models/Repository"

class RepositoriesController {
    async index(req, res) {
        try {
            const { user_id} = req.params
            const { q } = req.query

            const user = await User.findById(user_id);

            if(!user){
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado'})
            }
            
            let query = {}

            if(q) {
                query = { url: { $regex: q } }
            }

            const repositories = await Repository.find({
                userId: user_id,
                ...query
            });

            return res.json(repositories)
        } catch(error) {
            return res.status(500).json({ msg: 'Erro', error})
        }
    }


    async create(req, res) {
        try {
            const { user_id } = req.params
            const { name, url} = req.body

            const user = await User.findById(user_id);

            if(!user){
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado'})
            }

            const repository = await Repository.findOne({
                userId: user_id,
                url
            })
            
            if(repository) {
                return res.status(422).json({ msg: `Repositório ${name} já existe`})
            }

            const newRepository = await Repository.create({
                name,
                url,
                userId: user_id
            })

            return res.status(201).json(newRepository)
        } catch(error) {
            return res.status(500).json({ msg: 'Erro', error})
        }
    }

    async destroy(req, res) {
        try {
            const { user_id, id } = req.params
            
            const user = await User.findById(user_id);

            if(!user){
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado'})
            }

            const repository = await Repository.findOne({
                userId: user_id,
                _id: id
            });

            if(!repository) {
                return res.status(404).json({ msg: `[ERRO]:`})
            }

            const repositoryDeleted = await repository.deleteOne()

            return res.status(200).json(repositoryDeleted)
        } catch(error) {
            return res.status(500).json({ msg: '[ERRO]:', error})
        }
    }
}

export default new RepositoriesController();