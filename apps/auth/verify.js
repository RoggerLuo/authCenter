const jwt = require('jsonwebtoken')
const encrypt_key = '30a1514084ef'
module.exports = function*(token) {
    try {
        const decoded = yield jwt.verify(token, encrypt_key)
        return decoded
    } catch (e) {
        const error = Error('authorization failed')
        error.name = 401
        throw error
    }
}
