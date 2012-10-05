jade = require('jade');

module.exports = {
  extensions : ['jade'],
  compiler : function(preCompile) {
    return 'module.exports = ' + jade.compile(preCompile, {
      client: true,
      compileDebug: false
    }).toString();
  }
};