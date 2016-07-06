/**
 * Created by ddavid on 2015-11-16.
 *
 * beta 0.1 version
 *
 *
 *
 *  == how to start ==  this is very easy way
 *
 * colorScripting.initLanguage("javascript", "sh");
 * colorScripting.setContent(document.getElementById('before').value);
 * var changedContent = colorScripting.start();
 *
 */
/**
 * @type {{data: {}, init: Function, setLanguage: Function}}
 */
var colorScripting = {
    data: {
        convertedObjects: [], // this value is converted objects
        currentLogic: {}, // logic is kind of one reular pattern
        startIndex: 0
    },

    /**
     *
     * @returns {converted string}
     */
    start: function () {
        return this.parser.execute();
    },

    /**
     * before start you have to set content
     * @param content
     */
    setContent: function (content) {
        this.parser.setContent(content);
    },

    initLanguage: function (languageName, name) {
        this.parser.sequenceLogic = this.languages[languageName][name].sequenceLogic;
    },


    /**
     * this is private function that we don't have to know
     * @param languageName
     * @param name
     * @param language
     */
    setLanguage: function (languageName, name, language) {
        if (typeof this.languages[languageName] == 'undefined') {
            this.languages[languageName] = {};
        }
        this.languages[languageName][name] = language;
    },
    languages: {},
    parser: null,
    util: null
};

(function () {

    /**
     * this is common regular parser and working Sequentially FIFO [regular expression ]
     */
    var parser = function () {
        this.contents = [];
        this.originalContent = "";
        this.changedcontent = "";

        this.sequenceLogic = "";

        this.currentLogic = {};


        this.setContent = function (content) {
            this.contents = [{startIndex: 0, content: content}];
            this.originalContent = content;
        },

        /**
         * this is first called
         */
            this.execute = function () {
                // before start, initialize all data
                colorScripting.data.convertedObjects = [];
                colorScripting.data.startIndex = 0;
                var todoContent = this.contents;

                for (var i = 0; i < this.sequenceLogic.length; i++) {
                    this.currentLogic = this.sequenceLogic[i];
                    colorScripting.data.currentLogic = this.currentLogic;

                    //console.log("###############################");
                    //console.log(colorScripting.data.currentLogic.regExp );
                    for(var k=0; k<todoContent.length;k++){

                        //console.log('start Index : ' + todoContent[k].startIndex);
                        //console.log('content : ' + todoContent[k].content);
                    }


                    var len = todoContent.length;
                    for (var j = 0; j < len; j++) {
                        colorScripting.data.startIndex = todoContent[j].startIndex;
                        var changedContent = todoContent[j].content.replace(this.currentLogic.regExp, this.parsingCallback);
                    }

                    // compare and sort by start index
                    colorScripting.data.convertedObjects.sort(this.compare);

                    // get contents that is not conveted yet
                    var objs = colorScripting.data.convertedObjects;
                    todoContent = this.getContents(objs);


                   // //console.log(todoContent);
                }

                this.changedcontent = this.convertedContent();
                //console.log("$$$$$$$$$$$$$$$$$$$ converted Content $$$$$$$$$$$$$$$$$$$$$$");
                //console.log(this.changedcontent);

                //

                //

                this.changedcontent = this.changedcontent.replace(/.*?\n|.*>/g, this.callbackNewline);
                //console.log("$$$$$$$$$$$$$$$$$$$ converted Newline $$$$$$$$$$$$$$$$$$$$$$");
                //console.log(this.changedcontent);
                this.changedcontent = this.changedcontent.replace(/>.+?\s?[a-zA-Z0-9(){}\[\]]/g, this.callbackLineFirstWhitespace);
                //console.log("$$$$$$$$$$$$$$$$$$$ converted whiteSpace $$$$$$$$$$$$$$$$$$$$$$");
                //console.log(this.changedcontent);

                return this.changedcontent;
            },

            this.callbackNewline = function (str, a, b, c) {

                if (str.trim() == '') {
                    str = "<span ></span>"
                }
                return "<div style='height:20px;white-space: nowrap;'>" + str + "</div>"
            };

        this.callbackLineFirstWhitespace = function (str, a, b, c) {

            return str.replace(/\t/g, '&nbsp;&nbsp;&nbsp;').replace(/\s/g, '&nbsp;');
        };

        /**
         * make one string with converted array
         */
        this.convertedContent = function () {
            var objs = colorScripting.data.convertedObjects;
            //console.log(objs);
            var startIndex = 0;
            var convertedContent = "";

            for (var i = 0; i < objs.length; i++) {
                if (typeof objs[i].startIndex == 'undefined') {
                    continue;
                }
                if (i == 0) {
                    if (objs[i].startIndex == 0) {  // 시작일때
                    } else {
                        convertedContent += this.escapeString(this.originalContent.substring(0, objs[i].startIndex));
                        //convertedContent += objs[i].str;
                    }
                    convertedContent += objs[i].str;
                } else {
                    convertedContent += this.escapeString(this.originalContent.substring(startIndex, objs[i].startIndex));
                    convertedContent += objs[i].str;

                }
                startIndex = objs[i].endIndex;

                if (i == objs.length - 1) {
                    convertedContent += this.escapeString(this.originalContent.substring(objs[i].endIndex, this.originalContent.length));
                }
            }

            if(objs.length ==0){
                convertedContent = this.originalContent;
            }

            return convertedContent;
        }

        /**
         * escape string
         * @param value
         * @returns {string}
         */
        this.escapeString = function (value) {
            return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
        }

        this.getContents = function (objs) {
            var contents = [];
            var startIndex = 0;
            var endIndex = 0;
            for (var i = 0; i < objs.length; i++) {
                if (typeof objs[i].startIndex == 'undefined') {
                    continue;
                }
                if (i == 0 && objs[i].startIndex == 0) {
                    startIndex = objs[i].endIndex;
                }
                else {
                    contents.push({
                        startIndex: startIndex,
                        'content': this.originalContent.substring(startIndex, objs[i].startIndex)
                    });
                    startIndex = objs[i].endIndex;

                    /*if (i == objs.length - 1) {
                        contents.push({
                            startIndex: objs[i].endIndex,
                            'content': this.originalContent.substring(objs[i].endIndex, this.originalContent.length)
                        });
                    }*/
                }
            }

            if (startIndex < this.originalContent.length) {
                contents.push({
                    startIndex: startIndex,
                    'content': this.originalContent.substring(startIndex, this.originalContent.length)
                });
            }

            return contents;
        }

        this.compare = function (a, b) {
            if (a.startIndex < b.startIndex)
                return -1;
            if (a.startIndex > b.startIndex)
                return 1;
            return 0;
        }

        // save converted data and index
        this.parsingCallback = function (str, p1, p2, p3, p4, offset, s) {

            var index = 0;
            // find index
            for (var i = 1; i < arguments.length; i++) {
                if (typeof arguments[i] === 'number') {
                    index = arguments[i];
                    break;
                }
            }

            var obj = {
                startIndex: index + colorScripting.data.startIndex,
                endIndex: index + str.length + colorScripting.data.startIndex,
                str: '<span style="color: ' + colorScripting.data.currentLogic.color + '">' + str.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;') + '</span>'
            }


            // process function 이 있는 경우 아래의 케이스를 탄다.
            if (typeof  colorScripting.data.currentLogic.customProcess != 'undefined') {
                obj.str = colorScripting.data.currentLogic.customProcess(colorScripting.data.currentLogic, str);
            }

            //console.log("parsingCallback : " + str);
            //console.log("parsingCallback : " + obj.str );

            colorScripting.data.convertedObjects.push(obj);
            return str;
        }
    }

    /**
     * here add your language regular expression.
     */


    // javascript
    var javascript_sh = function () {

        this.sequenceLogic = [{
            regExp: /\/\*[^]*?\*\//g, // comments multiline
            color: "#C1C7C9",
            customProcess: function (logic, str) {
                var arr = str.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').split('\n');
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = '<span style="color: ' + logic.color + '">' + arr[i] + '</span>'
                }
                return arr.join('\n');
            }
        },
            {
            regExp: /\/\/.*/g, // comment
            color: "#C1C7C9"
        },
            {
            regExp: /".*?"|'.*?'/g, // string
            color: "#f00000"
        }, {
            regExp: /[0-9]+/g,
            color: "#3EC9F7"
        }, {
            regExp: /\b(function|for|while|var|in|if|else)\b/g,
            //regExp : /function|for|while|var|in|if|else/g,
            color: "#ED18ED"
        }, {
            regExp: /\b(return|true|null|false)\b/g,
            color: "#250DFF"
        }, {
            regExp: /\b(prototype|call|apply|length)\b/g,
            color: "#43D10F"
        }, {
            regExp: /\b(this)\b/g,
            color: "#34BFED"
        }, {
            regExp: /\b(new|Object)\b/g,
            color: "#34BFED"
        }, {
            regExp: /\b(break|continue)\b/g,
            color: "#34BFED"
        }, {
            regExp: /\b(window|Object|document)\b/g,
            color: "#34BFED"
        }, {
            regExp: /\b(Infinity|NaN|undefined|null|eval|uneval|isFinite|isNaN|parseFloat|parseInt|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|unescape)\b/g,
            color: "#34BFED",
            explain: "built in "// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        }, {
            regExp: /\b(Object|Function|Boolean|Symbol|Error|EvalError|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|Number|Math|String|RegExp)\b/g,
            color: "#34BFED",
            explain: "built in 2"// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        }, {
            regExp: /\b(ArrayBuffer|DataView|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Uint32Array|Float32Array|Float64Array)\b/g,
            color: "#34BFED",
            explain: "built in 3"// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        }];
    }

    var util = function () {
        this.clickcopy = function (id) {
		
			var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
			if(isChrome){
				var testDiv = document.getElementById(id);
				this.execCommandOnElement(testDiv, "selectAll");
				this.execCommandOnElement(testDiv, "Copy");
				this.execCommandOnElement(testDiv, "Unselect");
				alert("copied ");
			}else{
				alert("currently only chrome is available ");
			}
			
            
        }

        this.execCommandOnElement = function (el, commandName, value) {
            if (typeof value == "undefined") {
                value = null;
            }

            if (typeof window.getSelection != "undefined") {
                // Non-IE case
                var sel = window.getSelection();

                // Save the current selection
                var savedRanges = [];
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    savedRanges[i] = sel.getRangeAt(i).cloneRange();
                }

                // Temporarily enable designMode so that
                // document.execCommand() will work
                document.designMode = "on";

                // Select the element's content
                sel = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);

                // Execute the command
                document.execCommand(commandName, false, value);

                // Disable designMode
                document.designMode = "off";

                // Restore the previous selection
                sel = window.getSelection();
                sel.removeAllRanges();
                for (var i = 0, len = savedRanges.length; i < len; ++i) {
                    sel.addRange(savedRanges[i]);
                }
            } else if (typeof document.body.createTextRange != "undefined") {
                // IE case
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.execCommand(commandName, false, value);
            }
        }
    }


    colorScripting.setLanguage("javascript", "sh", new javascript_sh());
    colorScripting.parser = new parser();
    colorScripting.util = new util();
})();