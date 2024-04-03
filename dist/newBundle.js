(function (modules) {
function require(id) {
const [fn, mapping] = modules[id];

const module = {
exports: {},
};

function localRequire(filePath) {
const id = mapping[filePath];

return require(id);
}

fn(localRequire, module, module.exports);

return module.exports;
}

require(0);

})({

    "0":[function(require, module, exports){
        "use strict";

var _foo = require("./foo.js");

(0, _foo.foo)();
console.log("main.js");
            },{"./foo.js":1}],
                
    "1":[function(require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

var _user = require("./user.json");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo() {
  (0, _bar.bar)();
  console.log("foo.js");
}
            },{"./bar.js":2,"./user.json":3}],
                
    "2":[function(require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log("bar");
}
            },{}],
                
    "3":[function(require, module, exports){
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\r\n  \"a\": 1\r\n}\r\n";
            },{}],
                
                    });