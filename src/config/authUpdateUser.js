// require('dotenv/config')
import dotenv from 'dotenv'

dotenv.config();

export default {
    secret: process.env.APP_SECRET,
    expiresIn: 600 // 10 min
}