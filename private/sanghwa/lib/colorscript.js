/**
 * Created by ddavid on 2015-11-16.
 */
/**
 *
 *
 * @type {{data: {}, init: Function, setLanguage: Function}}
 */
var colorScripting = {
    data : { convertedObjects : [],
        currentLogic : {},
    startIndex :0},

    init : function(name){

    },

    start : function(){
        return this.controller.execute();
    },

    setContent : function(content){
        this.controller.setContent(content);
    },

    initLanguage : function(languageName, name){
        this.controller.sequenceLogic = this.languages[languageName][name].sequenceLogic;
    },

    setLanguage : function(languageName, name, language){

        if(typeof this.languages[languageName] == 'undefined'){
            this.languages[languageName] = {};
        }

        this.languages[languageName][name]  = language;
    },

    languages : {},

    controller : null
};

(function(){
    /**
     * 언어 셋팅
     */

        // javascript
   var javascript_sh =   function(){

        this.sequenceLogic= [{
           regExp : /\/\*[^]*?\*\//g, // 대주석
           color : "#C1C7C9"
        },{
            regExp : /\/\/.*/g, // 일반주석
            color : "#C1C7C9"
        },{
            regExp : /".*?"|'.*?'/g, // string
            color : "#f00000"

        },{
            regExp : /[0-9]+/g,
            color : "#fc142b"
        },{
            regExp : /function|for|while|var|in|if|else/g,
            color : "#ED18ED"
        },{
            regExp : /return|true|null|false/g,
            color : "#250DFF"
        },{
            regExp : /prototype|call|apply|length/g,
            color : "#250DFF"
        },{
            regExp : /this/g,
            color : "#34BFED"
        },{
            regExp : /new|Object/g,
            color : "#34BFED"
        },{
            regExp : /break|continue/g,
            color : "#34BFED"
        }];
   }

    // controller 이거는 사용안함
    var controller = function(){
        this.contents = [];
        this.originalContent ="";
        this.changedcontent = "";

        this.sequenceLogic="";

        this.currentLogic = {};


        this.setContent = function(content){
            this.contents = [{startIndex : 0, content: content}];
            this.originalContent = content;
        },

            this.execute = function(){
                // 초기화
                colorScripting.data.convertedObjects = [];
                colorScripting.data.startIndex =0;
                var todoContent = this.contents;

                console.log(this.sequenceLogic);
                console.log(this.sequenceLogic.length);
                for(var i=0; i<this.sequenceLogic.length; i++){
                    this.currentLogic = this.sequenceLogic[i];
                    colorScripting.data.currentLogic = this.currentLogic;

                    var len = todoContent.length;
                    for(var j=0; j<len ;j++){
                        colorScripting.data.startIndex =todoContent[j].startIndex;
                        var changedContent = todoContent[j].content.replace(this.currentLogic.regExp, this.parsingCallback);
                    }
                    // compare 링
                    colorScripting.data.convertedObjects.sort(this.compare);

                    // 태그와 태그 사이 컨텐츠 구분
                    var objs = colorScripting.data.convertedObjects;
                    todoContent = this.getContents(objs);

                    console.log(todoContent );
                }

                this.changedcontent = this.convertedContent();
                console.log(this.changedcontent);

                return this.changedcontent;
            },

            this.convertedContent =function(){
                var objs = colorScripting.data.convertedObjects;
                var startIndex =0;
                var convertedContent = "";

                for(var i=0; i<objs.length; i++){
                    if(typeof objs[i].startIndex =='undefined'){
                        continue;
                    }
                    if(i ==0 ){
                        if(objs[i].startIndex ==0){  // 시작일때
                            convertedContent += this.originalContent.substring(startIndex , objs[i].endIndex);
                        }else{
                            convertedContent += this.originalContent.substring(0, objs[i].startIndex);
                            convertedContent += objs[i].str;
                        }
                    }else{
                        convertedContent += this.originalContent.substring(startIndex , objs[i].startIndex);
                        convertedContent += objs[i].str;
                    }
                    startIndex = objs[i].endIndex;

                    if(i==objs.length-1){
                        convertedContent += this.originalContent.substring(objs[i].endIndex , this.originalContent.length);
                    }

                }
                return convertedContent;

            }

        this.getContents = function(objs){
            var contents = [];
            var startIndex =0;
            var endIndex =0;
            for(var i=0; i<objs.length; i++){
                if(typeof objs[i].startIndex =='undefined'){
                    continue;
                }
                if(i ==0 && objs[i].startIndex ==0){
                    startIndex = objs[i].endIndex;
                }else if(i==objs.length-1){
                    contents.push ( {startIndex :  objs[i].endIndex, 'content' : this.originalContent.substring(objs[i].endIndex, this.originalContent.length)});
                }
                else{
                    contents.push ( {startIndex : startIndex, 'content' : this.originalContent.substring(startIndex, objs[i].startIndex)});
                    startIndex = objs[i].endIndex;
                }
            }
            return contents;
        }

        this.compare = function (a,b) {
            if (a.startIndex < b.startIndex)
                return -1;
            if (a.startIndex > b.startIndex)
                return 1;
            return 0;
        }

        this.parsingCallback = function (str, p1, p2, p3, p4,  offset, s){
            var obj = {
                startIndex : p1 +  colorScripting.data.startIndex,
                endIndex : p1+ str.length +  colorScripting.data.startIndex,
                str :'<span style="color: '+ colorScripting.data.currentLogic.color +'">'+str + '</span>'
            }
            colorScripting.data.convertedObjects.push(obj);
            return str;
        }
    }

    colorScripting.setLanguage("javascript", "sh", new javascript_sh());
    colorScripting.controller =new controller();
})();