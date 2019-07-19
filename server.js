var app = require("./app");
var port = 3001;

var server = app.listen(port, function() {
  console.log("Express server listening on port " + port);
});
