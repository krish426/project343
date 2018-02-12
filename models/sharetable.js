const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

      const UserSchema = new Schema({
        sharetoid:String,
        sharetoname:String,
        tableid:String,
        tableuserid:String,
        tableusername:String,
        tablename:String,
        tdata:   Array,
      });
      module.exports = mongoose.model('sharetable',UserSchema);
