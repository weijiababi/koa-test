const router = require('koa-router')()
const controller = require('../controller/user')

router.post('/getUser', controller.getUser)
router.get('/getUserList', controller.getUserList)
router.post('/login', controller.login)
router.post('/register', controller.register)
router.post('/resetUser', controller.resetUser)

module.exports = router
