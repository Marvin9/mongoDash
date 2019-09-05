const Router = require('koa-router')
const routers = new Router()

const db = require('../config/db')

const delDb = require('../util/utility').dropDatabase
const delCol = require('../util/utility').dropCollection
const deleteKey = require('../util/utility').deleteKey

routers.del('/database', async ctx => {
    let {dbName} = ctx.request.body
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await delDb(_db)
})

routers.del('/collection', async ctx => {
    let {dbName, collection} = ctx.request.body 
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await delCol(_db, collection)
})

routers.del('/delete', async ctx => {
    let {dbName, collection, key} = ctx.request.body 
    key = JSON.parse(key)
    let client = await db.getDB()
    let _db = client.db(dbName) 
    ctx.body = await deleteKey(_db, collection, key)
})

module.exports = routers