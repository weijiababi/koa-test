const Koa = require('koa')
const Kcors = require('kcors')
const bodyParse = require('koa-bodyparser')
const app = new Koa()

const corsOptions = {
  origin: '',
  credentials: true,
  maxAge: 3600
}
app.use(Kcors(corsOptions))
app.use(
  bodyParse({
    formLimit: '1mb'
  })
)
app.use(require('./routers/user').routes())
module.exports = app
