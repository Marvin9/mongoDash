const Router = require('koa-router')
const routers = new Router

const db = require('../config/db')

const createDB = require('../util/utility').createDatabase
const createColl = require('../util/utility').createCollection
const insertDB = require('../util/utility').insert

routers.post('/database', async ctx => {
    let {dbName} = ctx.request.body 
    ctx.body = await createDB(dbName)
})

routers.post('/collection', async ctx => {
    let { collection, dbName } = ctx.request.body
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await createColl(_db, collection)
})

routers.post('/insert', async ctx => {
    let { dbName, collection, object } = ctx.request.body
    let arrayOfTuples = object.tuples
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await insertDB(_db, collection, arrayOfTuples)
})

module.exports = routers