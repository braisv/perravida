
var fs = require('fs');
var sqlSchema = fs.readFileSync('sql/createSchema.sql').toString();

module.exports = function(db) {
    db.serialize(function() {
        db.run(sqlSchema);
    });
};