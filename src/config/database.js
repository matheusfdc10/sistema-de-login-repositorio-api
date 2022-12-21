import 'dotenv/config'

export default {
    url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sgerfeh.mongodb.net/?retryWrites=true&w=majority`
}