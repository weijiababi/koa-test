const Koa = require('koa')
const path = require('path')
const app = new Koa()
const Kcors = require('kcors')
const bodyParse = require('koa-bodyparser')
const routers = require('./routers/index')
const session = require('koa-session-minimal')
const mySqlStore = require('koa-mysql-session')
const koaStatic = require('koa-static')
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

//数据session
let store = new mySqlStore({
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST
})

let cookie = {
  domain: 'http://localhost:8888', // 写cookie所在的域名
  httpOnly: false, // 是否只用于http请求中获取
  overwrite: true // 是否允许重写
}

app.use(
  session({
    key: 'session_id',
    store,
    cookie
  })
)
app.use(async ctx => {
  // 设置session
  if (ctx.url === '/set') {
    ctx.session = {
      user_id: Math.random()
        .toString(36)
        .substr(2),
      count: 0
    }
    ctx.body = ctx.session
  } else if (ctx.url === '/') {
    // 读取session信息
    ctx.session.count = ctx.session.count + 1
    ctx.body = ctx.session
  }
})

//static
app.use(koaStatic(path.join(__dirname, './static/images')))
//http://localhost:8888/exh1.jpg 可以在地址栏输入这个测试

//api routers,设置api路由
app.use(routers.routes()).use(routers.allowedMethods())
module.exports = app

//session 存储配置
/*
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
)*/
