const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

      const UserSchema = new Schema({
        username:String,
        userid:String,
        tablename:String,
        viewspace:String,
        tdata:   Array,
      });
      module.exports = mongoose.model('table',UserSchema);
