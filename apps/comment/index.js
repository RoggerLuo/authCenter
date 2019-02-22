const express = require('express')
const router = express.Router()
const app = require('./app')
router.post('/:postId',app.createComment)
router.post('/:postId/:commentId',app.createReply)

router.get('/:postId', app.getComments)
router.get('/:postId/:commentId', app.getReplies)
router.delete('/:_id',app.deleteOne)

module.exports = router