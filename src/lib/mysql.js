const mysql = require('mysql')
const config = require('../config/config')

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  port: config.database.PORT
})

const query = (sql, values = []) => {
  console.log(mysql.format(sql, values))
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        connection.query(sql, values, (errors, rows) => {
          if (errors) {
            console.log(errors)
            reject(errors)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

exports.getUser = async id => {
  let _sql = `select * from user where id=${id}`
  return query(_sql)
}
exports.checkUser = async id => {
  let _sql = `select count(*) as count from user where id=${id}`
  return query(_sql)
}
exports.findUserCount = async values => {
  let _sql = `select count(*) as count from user where name=? or phone=?`
  return query(_sql, values)
}
exports.getUserList = async () => {
  let _sql = 'select * from user'
  return query(_sql)
}
exports.login = async user => {
  let _sql = 'select * from user where name=? and password=?'
  return query(_sql, user)
}
exports.register = async user => {
  let _sql = 'insert into user set name=?, password=?, phone=?'
  return query(_sql, user)
}
exports.resetUser = async user => {
  let _sql = 'update user set name=?, password=?, phone=? where id=?'
  return query(_sql, user)
}
