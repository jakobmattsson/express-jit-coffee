var fs = require('fs');
var path = require('path');
var coffee = require('coffee-script');
var less = require('less');

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
    if (req.url.match(/\.coffee$/)) {
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
          res.send(code, { 'Content-Type': 'text/javascript' });
        }
      });
    } else if (req.url.match(/\.less$/)) {
      fs.readFile(root + req.url, 'utf8', function(err, content) {
        if (err) {
          next();
        } else {
          try {
            less.render(content, { paths: [path.dirname(root + req.url)] }, function(err, css) {
              if (err) {
                fail(req, err);
                next();
              } else {
                res.send(css, { 'Content-Type': 'text/css' });
              }
            });
          } catch (e) {
            fail(req, e);
            next();
          }
        }
      });
    } else {
      next();
    }
  };
};