const Router = require('koa-router')
const routers =  new Router()

const db = require('../config/db')

const getDBList = require('../util/utility').getDatabaseList
const getColList = require('../util/utility').getCollectionList
const getCol = require('../util/utility').getCollection

routers.get('/databases', async ctx => {
    let client = await db.getDB()
    let admin = client.db('test').admin()
    ctx.body = await getDBList(admin)
})

routers.get('/:db/collections', async ctx => {
    let databaseName = ctx.params.db
    if(databaseName === "admin" || databaseName === "config" || databaseName === "local")
        ctx.body = []
    else 
    {
        let client = await db.getDB()
        let _db = client.db(databaseName)
        ctx.body = await getColList(_db)
    }
})

routers.get('/collection', async ctx => {
    let databaseName = ctx.query.db, collection = ctx.query.collection 
    let client = await db.getDB()
    let _db = client.db(databaseName) 
    ctx.body = await getCol(_db, collection)
})

module.exports = routers