const Koa = require('koa')
const path = require('path')
const app = new Koa()
const Kcors = require('kcors')
const bodyParse = require('koa-bodyparser')
const routers = require('./routers/index')
const session = require('koa-session-minimal')
const mySqlStore = require('koa-mysql-session')
const config = require('./config/config')

//Access-Control-Allow-Origin设置跨域
const corsOptions = {
  origin: '',
  credentials: true,
  maxAge: 3600
}
app.use(Kcors(corsOptions))

//parse the formData解析请求数据
app.use(
  bodyParse({
    formLimit: '1mb'
  })
)

//session 存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST
}
app.use(
  session({
    key: 'USER_SID',
    store: new mySqlStore(sessionMysqlConfig)
  })
)

//api routers,设置api路由
app.use(routers.routes()).use(routers.allowedMethods())
module.exports = app
