'use strict';

var rsvp= require('rsvp');
var Writer = require('broccoli-writer');
var critical = require('critical');

function CriticalWriter (inputTree, options) {
	if (!(this instanceof CriticalWriter)) return new CriticalWriter(inputTree, options);

  	options = options || {};

  	this.inputTree = inputTree;
  	this.page = options.page || 'index.html';
  	this.cssFile = options.cssFile || '';
  	this.placeHolder = options.placeHolder || '';
  	this.width = options.width || 1300;
  	this.height = options.height || 900;
  	this.minify = options.minify || true;
  	this.extract = options.extract || true;
}

CriticalWriter.prototype = Object.create(Writer.prototype);
CriticalWriter.prototype.constructor = CriticalWriter;

CriticalWriter.prototype.write = function (readTree, destDir) {
	var self = this;

	return readTree(self.inputTree).then(function (srcDir) {
		var promise = new rsvp.Promise(function(resolvePromise, rejectPromise) {
			critical.generate({
				base: srcDir,
				src: self.page,
				minify: self.minify,
				extract: self.extract,
				width: self.width,
				height: self.height
			}, function (err, output) {
				if (err) {
					rejectPromise(err);
				}
				else {
					resolvePromise(output);
				}
			});
  		});
  		
  		return promise;
	});

};

module.exports = CriticalWriter;
