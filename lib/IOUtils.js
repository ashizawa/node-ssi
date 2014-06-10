
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var Iconv = require('iconv').Iconv;
var Buffer = require("buffer").Buffer;

module.exports = (function() {
	"use strict";

	var IOUtils = function(documentRoot) {
		this.documentRoot = documentRoot;
	};

	IOUtils.prototype = {

		/* Public Methods */

		resolveFullPath: function(currentFile, file) {
			return path.resolve(path.dirname(currentFile), file);
		},

		readFileSync: function(currentFile, includeFile, inputEncoding, outputEncoding) {
			var filename = this.resolveFullPath(currentFile, includeFile);
      var iconv = new Iconv(outputEncoding, 'UTF-8//TRANSLIT//IGNORE');
			return iconv.convert(new Buffer(fs.readFileSync(filename), inputEncoding)).toString();
		},

		readVirtualSync: function(currentFile, includeFile, inputEncoding, outputEncoding) {
			var filename;

			if (includeFile.indexOf("/") === 0) {
				// If we have an absolute path, resolve against the document root
				filename = path.resolve(this.documentRoot, includeFile.substr(1));
			} else {
				// Otherwise resolve the file against the current file
				filename = this.resolveFullPath(currentFile, includeFile);
			}
      var iconv = new Iconv(outputEncoding, 'UTF-8//TRANSLIT//IGNORE');
			return iconv.convert(new Buffer(fs.readFileSync(filename), inputEncoding)).toString();
		},

		writeFileSync: function(filename, contents) {
			var directory = path.dirname(filename);

			if (!fs.existsSync(directory)) {
				// If the file's directory doesn't exists, recursively create it
				//noinspection JSUnresolvedFunction
				mkdirp.sync(directory);
			}

			fs.writeFileSync(filename, contents, {encoding: "utf8"});
		}

		/* Private Methods */
	};

	// Export the IOUtils class for use
	return IOUtils;
})();
