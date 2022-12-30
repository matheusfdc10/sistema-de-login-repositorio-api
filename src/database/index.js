import mongoose from 'mongoose'
import config from '../config/database.js'
 
class Database {
    constructor() {
        mongoose.set("strictQuery", true);
        this.connection = mongoose.connect(config.url)
            .then(() => {
                console.log('Conectado ao banco')
            })
            .catch(err => {
                console.log(err)
            })
    }
}

export default new Database();