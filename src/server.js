import app from './app.js'
// require('dotenv/config')
import dotenv from 'dotenv'

dotenv.config();

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('conectado!')
})