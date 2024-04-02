(function (modules) {
  function require(filePath) {
    const fn = modules[filePath];

    const module = {
      exports: {},
    };

    fn(require, module, module.exports);

    return module.exports;
  }

  require("./main.js");
})({
  "./foo.js": function fooJs(require, module, exports) {
    // foo.js
    function foo() {
      console.log("foo.js");
    }

    module.exports = {
      foo,
    };
  },
  "./main.js": function mainJs(require, module, exports) {
    // main.js
    const { foo } = require("./foo.js");

    foo();

    console.log("main.js");
  },
});
