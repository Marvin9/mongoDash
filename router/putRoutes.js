const Router = require('koa-router')
const router = new Router()

const db = require('../config/db')

const updateCollection = require('../util/utility').updateCollection
const updateTuple = require('../util/utility').updateTuple
const updateMultiple = require('../util/utility').updateMultipleTuples

const mongo = require('mongodb')

router.put('/collection', async ctx => {
    let {dbName, collection, newCol} = ctx.request.body 
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await updateCollection(_db, collection, newCol)
})

router.put('/update', async ctx => {
    let {dbName, collection, uniqueId, newVal} = ctx.request.body
    uniqueId['_id'] = new mongo.ObjectID(uniqueId['_id'])
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await updateTuple(_db, collection, uniqueId, newVal)
})

router.put('/updatemulti', async ctx => {
    let {dbName, collection, key, newVal} = ctx.request.body 
    let client = await db.getDB()
    let _db = client.db(dbName)
    ctx.body = await updateMultiple(_db, collection, key, newVal)
})

module.exports = router