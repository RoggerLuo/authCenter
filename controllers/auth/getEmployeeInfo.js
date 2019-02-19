const co = require('co')
const assert = require('assert')
const Atwork_Tool = require('../../utils/atwork_tool')
const getEmployeeInfo = co.wrap(function*(req, client){
	try {
		assert(req.body.user_id, 'user_id不能为空')
		assert(req.body.domain_id, 'domain_id不能为空')
		assert(req.body.org_id, 'org_id不能为空')
		assert(req.body.ticket, 'ticket不能为空')
	} catch (e) {
		console.error(e)
		client.fail(Error('e_params'))
	}
	const ctx = {
		domainId: req.body.domain_id,
		orgId: req.body.org_id
	}
	const validateUserTicket = function() {
		console.log(' ********* 验证ticket ********* ')
		return Atwork_Tool.getAtworkInstance(ctx)
			.then(atworkInstance => atworkInstance.validateUserTicket(req.body.ticket, req.body.user_id))
	}
	return yield validateUserTicket()
})
module.exports = getEmployeeInfo