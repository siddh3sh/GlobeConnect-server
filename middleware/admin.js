
function checkAdmin(req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send('Access Denied');//403: Forbidden
    next()
}

module.exports = checkAdmin