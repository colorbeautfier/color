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
    data : {},

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

        this.content = "";
        this.changedcontent = "";

        this.sequenceLogic= [{
           regExp : "",
            color : "#0000"
        },{

        },{

        },{

        }];

        this.setContent = function(content){

        }
        this.execute = function(){
            while(this.sequenceLogic.length>0){
                var logic = this.sequenceLogic.shift();
                var regExp = logic.regExp;

            }
            return this.changedcontent;
        }
    }
    colorScripting.setLanguage("javascript", "sh", new javascript_sh());
})();

