import User from "../models/User.js"
import Repository from "../models/Repository.js"

class RepositoriesController {
    async index(req, res) {
        try {
            const userId = req.userId
            const { q } = req.query

            const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado'})
            }
            
            let query = {}

            if(q) {
                query = { url: { $regex: q } }
            }
            
            const repositories = await Repository.find({
                userId,
                ...query
            });

            return res.json(repositories)
        } catch(error) {
            return res.status(500).json({ msg: 'Aconteceu um erro ao tentar carregar repositórios.', error})
        }
    }

    async create(req, res) {
        try {
            const userId = req.userId
            const { name, url} = req.body

            const user = await User.findById(userId);

            if(!user) {
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado.'})
            }

            if(!url) {
                return res.status(404).json({ msg: 'Informe uma Url!'})
            }

            const repository = await Repository.findOne({
                userId,
                url
            })
            
            if(repository) {
                return res.status(422).json({ msg: `Repositório ${name} já existe!`})
            }

            const newRepository = await Repository.create({
                name,
                url,
                userId
            })

            return res.status(201).json({ msg: `Repositório ${name} adicionado com sucesso!`})
        } catch(error) {
            return res.status(500).json({ msg: 'Aconteceu um erro ao criar um novo repositório.', error})
        }
    }

    async update(req, res) {
        try {
            const userId = req.userId
            const { id } = req.params
            const { name, url} = req.body

            if(!url) {
                return res.status(404).json({ msg: 'Informe uma Url!'})
            }

            const user = await User.findById(userId);

            if(!user) {
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado.'})
            }

            const newRepository = await Repository.findOne({
                userId,
                url
            })
            
            if(newRepository) {
                return res.status(422).json({ msg: `Repositório ${name} já existe!`})
            }

            const repository = await Repository.findById(id);
            
            if(!repository) {
                return res.status(404).json({ msg: '[ERRO]: repositório não encontrado.'})
            }

            await repository.updateOne({ name, url })

            return res.status(200).json({ msg: `Repositório ${repository.name} atualizado para ${name}`});
        } catch(error) {
            return res.status(500).json({ msg: 'Aconteceu um erro ao atualizar repositório.', error})
        }
    }

    async destroy(req, res) {
        try {
            const userId = req.userId
            const { id } = req.params
            
            const user = await User.findById(userId);

            if(!user){
                return res.status(404).json({ msg: '[ERRO]: Usuário não encontrado.'})
            }

            if(!id){
                return res.status(404).json({ msg: 'Informe um repositório.'})
            }

            const repository = await Repository.findOne({
                userId,
                _id: id
            });

            if(!repository) {
                return res.status(404).json({ msg: 'Repositório não encontrado.'})
            }

            const repositoryDeleted = await repository.deleteOne()

            return res.status(200).json({ msg: `Repositório ${repositoryDeleted.name} excluido!` })
        } catch(error) {
            return res.status(500).json({ msg: 'Aconteceu um erro ao exluir repositório.', error})
        }
    }
}

export default new RepositoriesController();