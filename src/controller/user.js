const userModel = require('../lib/mysql')
const mixin = require('../lib/mixin')

const success = { code: 200, msg: 'success' }
const notFound = { code: 500, msg: 'not found' }
const fail = { code: 404, msg: 'error' }

async function checkUser(id) {
  return await userModel
    .checkUser(id)
    .then(res => {
      return res[0].count
    })
    .then(count => {
      return Promise.resolve(count === 1)
    })
}

exports.getUser = async ctx => {
  let { id } = ctx.request.body
  await checkUser(id)
    .then(async exist => {
      if (!exist) {
        throw new Error()
      }

      await userModel.getUser(id).then(res => {
        ctx.body = Object.assign(success, { data: res[0] })
      })
    })
    .catch(() => {
      ctx.body = notFound
    })
}

exports.getUserList = async ctx => {
  await userModel
    .getUserList()
    .then(res => {
      if (res.length === 0) {
        throw new Error()
      }
      let data = mixin.calData(res)
      ctx.body = Object.assign(success, data)
    })
    .catch(() => {
      ctx.body = notFound
    })
}

exports.login = async ctx => {
  let { name, password } = ctx.request.body

  await userModel
    .login([name, password])
    .then(res => {
      if (!res.length || res.length !== 0) {
        throw new Error()
      }
      ctx.body = success
    })
    .catch(() => {
      ctx.body = notFound
    })
}

exports.register = async ctx => {
  let { name, password, phone } = ctx.request.body

  await userModel
    .register([name, password, phone])
    .then(res => {
      if (!res) {
        throw new Error()
      }
      ctx.body = success
    })
    .catch(() => {
      ctx.body = {
        code: 10001,
        msg: 'had the same userInfo'
      }
    })
}

exports.resetUser = async ctx => {
  let { id, name, password, phone } = ctx.request.body
  await checkUser(id)
    .then(async exist => {
      if (!exist) {
        throw new Error()
      }

      await userModel.resetUser([name, password, phone, id]).then(() => {
        ctx.body = success
      })
    })
    .catch(() => {
      ctx.body = notFound
    })
}
