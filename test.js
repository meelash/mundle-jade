path = require('path');
fs = require('fs');
plugin = require('./index.js');
mundle = require('mundle');
mundle.use(plugin);
mundle.setBasePath(__dirname);

createTestFile = function(filePath, text) {
  var makePath;
  makePath = function(dirPath) {
    var parent;
    if (!fs.existsSync((parent = path.dirname(dirPath)))) {
      makePath(parent);
    }
    if (!fs.existsSync(dirPath)) {
      return fs.mkdirSync(dirPath);
    }
  };
  makePath(path.dirname(filePath));
  return fs.writeFileSync(filePath, text);
};

exports.testPlugin = function(test) {
  test.expect(2);

  createTestFile("" + __dirname + "/testPlugin.jade", "h1 Blahblah");

  mundle('/testPlugin.jade', {}, function(errors, modules) {
    test.ifError(errors, 'No errors should be returned');
    test.deepEqual(modules, {
      '/testPlugin.jade': 'module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {\nattrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;\nvar buf = [];\nwith (locals || {}) {\nvar interp;\nbuf.push(\'<h1>Blahblah</h1>\');\n}\nreturn buf.join("");\n}'
    }, 'Compiler should have returned compiled code from the plugin');
    fs.unlinkSync("" + __dirname + "/testPlugin.jade");
    return test.done();
  });
}