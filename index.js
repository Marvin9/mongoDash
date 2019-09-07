const koa = require('koa')
const app = new koa()

const get = require('./router/getRoutes')
const post = require('./router/postRoutes')
const del = require('./router/delRoutes')
const put = require('./router/putRoutes')

const parser = require('koa-bodyparser')

const cors = require('koa-cors')

app.use(cors())
app.use(parser())
app.use(get.routes())
app.use(post.routes())
app.use(del.routes())
app.use(put.routes())

app.listen('3000', () => l("Server running on 3000"))

l = (e) => console.log(e)