var marked = require('marked'),
fs = require('fs');

function MarkedMetaData(file) {
	
	if (typeof file != 'string') {
		throw new Error('MarkedMetaData() expecting string parameter.');
	}

	var mdFile = fs.existsSync(file) ? fs.readFileSync(file).toString() : file,
		tokens = ['---','---'],

		/* Convert metadata header into JSON */
		toJSON = function (data) {
			var tmpObj = {},
				lines = data.trim().split('\n');

			lines.forEach(function(line, i) {
				var arr = line.trim().split(':');
				tmpObj[arr.shift()] = arr.join(':').trim();
			});

			return tmpObj;
		},

		/* Extracts the header */
		getMarkdownHeader = function (data) {
			var strReg = "^" + tokens[0] + "([\\s|\\S]*?)" + tokens[1],
				reg = new RegExp(strReg),
				file = reg.exec(mdFile);

			return file ? file[1] : new Error("Can't get the header");
		},

		/* Extracts the content */
		getMarkdownContent = function (data) {
			var strReg = "^ *?\\" + tokens[0] + "[^]*?" + tokens[1] + "*",
				reg = new RegExp(strReg),
				content = data.replace(reg, "");

			return content ? marked(content) : new Error("Can't get the content");
		};

	/* Define the initial and last markdown header token */
	this.defineTokens = function (inital, last) {
		if (inital && last) {
			tokens[0] = inital;
			tokens[1] = last;
		}
	};

	/* Return the tokens */
	this.getTokens = function () {
		return tokens;
	};

	/* Just return the file */
	this.getFile = function () {
		return mdFile;
	};

	/* Return the markdown metadata */
	this.metadata = function () {
			var file = getMarkdownHeader(mdFile);

			if (file) {
				JSONData = toJSON(file);
			}
			return JSONData;
	};

	this.markdown = function (config) {
		return config && config.crop ?
			   getMarkdownContent(mdFile.split(config.crop)[0]):
			   getMarkdownContent(mdFile);
	};
};


function readMarkdownFile(file) {
    const md = new MarkedMetaData(file);
    return md;
}

module.exports = { readMarkdownFile };