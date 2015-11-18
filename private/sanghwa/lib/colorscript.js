/**
 * Created by ddavid on 2015-11-16.
 *
 *
 * 테스트 문서 https://code.jquery.com/jquery-2.1.4.js
 */
/**
 *
 *
 * @type {{data: {}, init: Function, setLanguage: Function}}
 */
var colorScripting = {
    data: {
        convertedObjects: [],
        currentLogic: {},
        startIndex: 0
    },

    init: function (name) {
    },

    start: function () {
        return this.parser.execute();
    },

    setContent: function (content) {
        this.parser.setContent(content);
    },

    initLanguage: function (languageName, name) {
        this.parser.sequenceLogic = this.languages[languageName][name].sequenceLogic;
    },

    setLanguage: function (languageName, name, language) {
        if (typeof this.languages[languageName] == 'undefined') {
            this.languages[languageName] = {};
        }
        this.languages[languageName][name] = language;
    },

    languages: {},

    parser: null
};

(function () {
    /**
     * 언어 셋팅
     */

    // javascript
    var javascript_sh = function () {

        this.sequenceLogic = [{
            regExp: /\/\*[^]*?\*\//g, // 대주석
            color: "#C1C7C9"
        }, {
            regExp: /\/\/.*/g, // 일반주석
            color: "#C1C7C9"
        }, {
            regExp: /".*?"|'.*?'/g, // string
            color: "#f00000"
        }, {
            regExp: /[0-9]+/g,
            color: "#ff2222"
        }, {
            regExp: /\b(function|for|while|var|in|if|else)\b/g,
            //regExp : /function|for|while|var|in|if|else/g,
            color: "#ED18ED"
        }, {
            regExp: /\b(return|true|null|false)\b/g,
            color: "#250DFF"
        }, {
            regExp: /\b(prototype|call|apply|length)\b/g,
            color: "#250DFF"
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
            regExp : /\b(window|Object|document)\b/g,
            color: "#34BFED"
        },{
            regExp : /\b(Infinity|NaN|undefined|null|eval|uneval|isFinite|isNaN|parseFloat|parseInt|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|unescape)\b/g,
            color: "#34BFED",
            explain : "built in "// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        },{
            regExp : /\b(Object|Function|Boolean|Symbol|Error|EvalError|InternalError|RangeError|ReferenceError|SyntaxError|TypeError|URIError|Number|Math|String|RegExp)\b/g,
            color: "#34BFED",
            explain : "built in 2"// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        },{
            regExp : /\b(ArrayBuffer|DataView|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Uint32Array|Float32Array|Float64Array)\b/g,
            color: "#34BFED",
            explain : "built in 3"// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
        }];
    }

    // controller 이거는 parsing 공통 부분
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

            this.execute = function () {
                // 초기화
                colorScripting.data.convertedObjects = [];
                colorScripting.data.startIndex = 0;
                var todoContent = this.contents;

                console.log(this.sequenceLogic);
                console.log(this.sequenceLogic.length);
                for (var i = 0; i < this.sequenceLogic.length; i++) {
                    this.currentLogic = this.sequenceLogic[i];
                    colorScripting.data.currentLogic = this.currentLogic;

                    var len = todoContent.length;
                    for (var j = 0; j < len; j++) {
                        colorScripting.data.startIndex = todoContent[j].startIndex;
                        var changedContent = todoContent[j].content.replace(this.currentLogic.regExp, this.parsingCallback);
                    }
                    // compare 링
                    colorScripting.data.convertedObjects.sort(this.compare);

                    // 태그와 태그 사이 컨텐츠 구분
                    var objs = colorScripting.data.convertedObjects;
                    todoContent = this.getContents(objs);

                    console.log(todoContent);
                }

                this.changedcontent = this.convertedContent();
                console.log(this.changedcontent);

                return this.changedcontent;
            },

            this.convertedContent = function () {
                var objs = colorScripting.data.convertedObjects;
                var startIndex = 0;
                var convertedContent = "";

                for (var i = 0; i < objs.length; i++) {
                    if (typeof objs[i].startIndex == 'undefined') {
                        continue;
                    }
                    if (i == 0) {
                        if (objs[i].startIndex == 0) {  // 시작일때
                            convertedContent += this.escapeString(this.originalContent.substring(startIndex, objs[i].endIndex));
                        } else {
                            convertedContent += this.escapeString(this.originalContent.substring(0, objs[i].startIndex));
                            convertedContent += objs[i].str;
                        }
                    } else {
                        convertedContent += this.escapeString(this.originalContent.substring(startIndex, objs[i].startIndex));
                        convertedContent += objs[i].str;
                    }
                    startIndex = objs[i].endIndex;

                    if (i == objs.length - 1) {
                        convertedContent += this.escapeString(this.originalContent.substring(objs[i].endIndex, this.originalContent.length));
                    }

                }
                return convertedContent;

            }

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
                } else if (i == objs.length - 1) {
                    contents.push({
                        startIndex: objs[i].endIndex,
                        'content': this.originalContent.substring(objs[i].endIndex, this.originalContent.length)
                    });
                }
                else {
                    contents.push({
                        startIndex: startIndex,
                        'content': this.originalContent.substring(startIndex, objs[i].startIndex)
                    });
                    startIndex = objs[i].endIndex;
                }
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

        this.parsingCallback = function (str, p1, p2, p3, p4, offset, s) {

            var index =0;
            // find index
            for(var i=1; i<arguments.length; i++){
                if(typeof arguments[i] === 'number'){
                    index = arguments[i];
                    break;
                }
            }

            var obj = {
                startIndex: index+ colorScripting.data.startIndex,
                endIndex: index + str.length + colorScripting.data.startIndex,
                str: '<span style="color: ' + colorScripting.data.currentLogic.color + '">' + str.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;') + '</span>'
            }
            colorScripting.data.convertedObjects.push(obj);
            return str;
        }
    }

    colorScripting.setLanguage("javascript", "sh", new javascript_sh());
    colorScripting.parser = new parser();
})();