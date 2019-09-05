const MongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

class DB {

    static async getDB() {
        if(this.db) return this.db 
        else {
            return new Promise((res, rej) => {
                MongoClient.connect(url,{useNewUrlParser : true, useUnifiedTopology : true} ,(err, client) => {
                    if(err) rej(err)
                    this.db = client 
                    res(this.db)
                })
            })
        }
    }
}

module.exports = DB