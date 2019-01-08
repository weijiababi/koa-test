const userModel = require('../lib/mysql')
const mixin = require('../lib/mixin')
const md5 = require('md5')

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
  try {
    await checkUser(id).then(async exist => {
      if (!exist) {
        throw new Error(500)
      }
      return Promise.resolve()
    })

    await userModel.getUser(id).then(res => {
      if (!res) {
        throw new Error(404)
      }
      ctx.body = Object.assign(success, { data: res[0] })
    })
  } catch (err) {
    switch (err.message) {
      case '404':
        ctx.body = fail
        break
      case '500':
        ctx.body = notFound
    }
  }
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
  try {
    await userModel.login([name, password]).then(res => {
      if (res.length === 0) {
        throw new Error(404)
      }
      const session = md5(
        Math.random()
          .toString(36)
          .substr(2) + name
      )
      ctx.body = Object.assign(success, {
        data: {
          session
        }
      })
    })
  } catch (err) {
    switch (err.message) {
      case '404':
        ctx.body = fail
        break
    }
  }
}

exports.register = async ctx => {
  let { name, password, phone } = ctx.request.body
  try {
    //查找是否有相同用户
    await userModel.findUserCount([name, phone]).then(async res => {
      if (res[0].count >= 1) {
        throw new Error(10001)
      }
      return Promise.resolve()
    })
    //进行注册操作
    await userModel.register([name, password, phone]).then(res => {
      if (!res) {
        throw new Error(404)
      }
      ctx.body = success
    })
  } catch (err) {
    //抓取error中的code
    switch (err.message) {
      case '404':
        ctx.body = fail
        break
      case '10001':
        ctx.body = {
          code: 10001,
          msg: 'has one more same user'
        }
        break
    }
  }
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
