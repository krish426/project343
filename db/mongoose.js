var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:pass12@ds125058.mlab.com:25058/demowork', { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = {mongoose};
