exports.create_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: post create GET');
    res.render('post_form',{title: 'post create GET'})
};
exports.create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: post create POST');
};
exports.update_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: post update GET');
    res.render('post_form')
};
exports.update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: post update POST');
};
exports.delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: post delete POST');
};
exports.published = function(req, res) {
    // res.send('NOT IMPLEMENTED: published posts');
    res.render('posts_published')
};
exports.draft = function(req, res) {
    // res.send('NOT IMPLEMENTED: draft posts');
    res.render('posts_draft')
};
