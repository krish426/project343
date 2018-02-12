const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

      const UserSchema = new Schema({
        tableid:String,
        tablename:String,
        rdata:   Array,
      });
      module.exports = mongoose.model('row',UserSchema);
