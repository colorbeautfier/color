/**
 * Created by ddavid on 2015-11-16.
 */
/**
 *
 * 예상 시나리오
 * 1. init ( 랭귀지 찾기 )
 * 2.
 *
 *
 *
 *
 * 만들기 위해서는 다른사람들이 랭귀지를 셋팅할수있도록 해야한다.
 *
 * 크게 작업해야하는 사항
 * 1. 주석
 * 2. string값
 * 3. 색깔체인지
 * 4. esacpe 문자 변경
 *
 *
 * @type {{data: {}, init: Function, setLanguage: Function}}
 */
var colorScripting = {
    data : { convertedObjects : [],
        currentLogic : {} },

    init : function(name){

    },

    start : function(){

    },

    setLanguage : function(languageName, name, language){

        if(typeof this.languages[languageName] == 'undefined'){
            this.languages[languageName] = {};
        }

        this.languages[languageName][name]  = language;
    },

    getLanguage : function(languageName, name){
        return this.languages[languageName][name];
    },

    languages : {}
};

(function(){
   var javascript_sh =   function(){

        this.contents = [];
       this.originalContent ="";
        this.changedcontent = "";

        this.sequenceLogic= [{
           regExp : /\/\*[^]*?\*\//g, // 대주석
           color : "#ff00ff"
        },{
            regExp : /\/\/.*/g, // 일반주석
            color : "#ffff00"
        },{
            regExp : /".*?"|'.*?'/g, // string
            color : "#f00000"

        },{
            regExp : /[0-9a-zA-Z]+/g, // 숫자나 글자인 부분
            color : "#555000"
        }];

       this.currentLogic = {};


        this.setContent = function(content){
            this.contents[0] = content;
            this.originalContent = content;
        },

        this.execute = function(){
            // 초기화
            colorScripting.data.convertedObjects = [];
            var todoContent = this.contents;

            for(var i=0; i<this.sequenceLogic.length; i++){



                this.currentLogic = this.sequenceLogic[i];
                colorScripting.data.currentLogic = this.currentLogic;
                var len = todoContent.length;
                for(var j=0; j<len ;j++){

                    var changedContent = todoContent[j].replace(this.currentLogic.regExp, this.parsingCallback);
                }
                // compare 링
                colorScripting.data.convertedObjects.sort(this.compare);

                // 태그와 태그 사이 컨텐츠 구분
                var objs = colorScripting.data.convertedObjects;
                todoContent = this.getContents(objs);

                console.log(todoContent );
            }
            return this.changedcontent;
        },
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
                    }else{
                         contents.push ( this.originalContent.substring(startIndex, objs[i].startIndex));
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
                startIndex : p1,
                endIndex : p1+ str.length,
                str :'<span style="color: '+ colorScripting.data.currentLogic.color +'">'+str + '<span>'
            }
            colorScripting.data.convertedObjects.push(obj);
            return str;
       }
   }
    colorScripting.setLanguage("javascript", "sh", new javascript_sh());
})();