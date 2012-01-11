var fs = require('fs');
var coffee = require('coffee-script');

module.exports = function(root, fail) {

  if (typeof root != "string") {
    root = __dirname;
  }

  if (typeof fail != "function") {
    fail = function(req, e) {
      console.log("Failed to compile " + req.url + ": " + e.message);
    }
  }

  return function(req, res, next) {
    if (!req.url.match(/\.coffee$/)) {
      next();
    } else {
      fs.readFile(root + req.url, 'utf8', function(err, content) {
        if (err) {
          next();
        } else {
          try {
            var code = coffee.compile(content);
          } catch (e) {
            fail(req, e);
            next();
            return;
          }
          res.send(code);
        }
      });
    }
  };
};