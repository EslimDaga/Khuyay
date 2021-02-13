module.exports = {
  isLoggeind(req,res,next){
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/signin");
  }
}