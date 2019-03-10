require("babel-polyfill");
require('babel-register')({
    presets: [ 
        "es2015",
        [
            "@babel/preset-env", {
                "targets": {
                  "node": "current"
                }
            }
        ]
    ]
})

module.exports = require('./server.js')