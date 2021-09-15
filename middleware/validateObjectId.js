const mongoose = require('mongoose');

module.exports = function (req,res,next) {
    if(!mongoose.Types.ObjectId.isValid(req.params.genre))
    return res.status(404).send('Invalid ID.');

    next();
    
}