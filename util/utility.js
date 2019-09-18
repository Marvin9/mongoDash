async function getDatabaseList(admin) {
    return new Promise((resolve, reject) => {
        admin.listDatabases((err, res) => {
           if(err) reject(err) 
            resolve(res.databases) 
        })
    })
}

async function getCollectionList(db) {
    return new Promise((resolve, reject) => {
        db.listCollections().toArray((err, collections) => {
            if(err) reject(err) 
            resolve(collections.map(coll => coll.name))
        })
    })
}

async function getCollection(db, collection) {
    return new Promise((resolve, reject) => {
        db.collection(collection).find({}).toArray((err, list) => {
            if(err) reject(err) 
            resolve(list)
        })
    })
}



async function createDatabase(dbname) {
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017"
    return new Promise((resolve) => {
        MongoClient.connect(url + '/' + dbname,{useNewUrlParser : true, useUnifiedTopology : true} ,(err) => {
            if(err) resolve({error : true, err})
            resolve({success : true})
        })
    })
}

async function createCollection(db, collection) {
    return new Promise((resolve) => {
        db.createCollection(collection, (err) => {
            if(err) resolve({error : true, err})
            resolve({success : true})
        })
    })
}

async function insert(db, collection, obj) {
    return new Promise(resolve => {
        db.collection(collection).insertMany(obj, (err, inserted) => {
            if(err) resolve({error : true, err})
            resolve({success : true, tuple : inserted})
        })
    })
}

async function dropDatabase(db) {
    return new Promise(resolve => {
        db.dropDatabase(err => {
            if(err) resolve({error : true, err})
            resolve({success : true})
        })
    })
}

async function dropCollection(db, collection) {
    return new Promise(resolve => {
        db.dropCollection(collection, (err, delOK) => {
            if(err) resolve({error : true, err})
            if(delOK) resolve({success : true})
        })
    })
}

async function deleteKey(db, collection, key) {
    return new Promise(resolve => {
        db.collection(collection).deleteOne(key, err => {
            if(err) resolve({error : true, err})
            resolve({success : true})
        })
    })
}

async function updateCollection(db, collection, newCollection) {
    return new Promise(resolve => {
        db.collection(collection).rename(newCollection, (err, newCol) => {
            if(err) resolve({error : true, err})
            resolve({success : true})
        })
    })
}

async function updateTuple(db, collection, uniqueId, newVal) {
    return new Promise(resolve => {
        db.collection(collection).updateOne(uniqueId, {$set : newVal}, (err, res) => {
            if(err) resolve({error : true, err})
            resolve({success : true, res})
        })
    })
}

async function updateMultipleTuples(db, collection, old, _new) {
    return new Promise(resolve => {
        db.collection(collection).updateMany(old, {$set : _new}, (err, res) => {
            if(err) resolve({error : true, err})
            resolve({success : true, res})
        })
    })
}

module.exports = {
    getDatabaseList,
    getCollectionList,
    getCollection,
    createDatabase,
    createCollection,
    insert,
    dropDatabase,
    dropCollection,
    deleteKey,
    updateCollection,
    updateTuple,
    updateMultipleTuples
}