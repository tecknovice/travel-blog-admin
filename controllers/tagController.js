exports.create_get = function(req,res,next){
    res.render('tag-create',{title:'Create tag',page:1})
}
exports.create_post = function(req,res,next){
    res.send('NOT IMPLEMENTED:tag create POST')
}
exports.update_get = function(req,res,next){
    res.send('NOT IMPLEMENTED:tag update GET')
}
exports.update_post = function(req,res,next){
    res.send('NOT IMPLEMENTED:tag update POST')
}
exports.delete = function(req,res,next){
    res.send('NOT IMPLEMENTED:tag delete POST')
}
exports.list = function(req,res,next){
    res.send('NOT IMPLEMENTED:tag list GET')
}