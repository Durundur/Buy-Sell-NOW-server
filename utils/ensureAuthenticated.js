
const ensureAuthenticated = (req,res, next)=> {
	if(req.isAuthenticated()){
		next()
	}
	else {
		res.status(401).send({message: 'You are not authenticated', redirect: '/logowanie'})
	}
}	


module.exports = ensureAuthenticated;