function boneAge(){

}
boneAge.prototype={
    init:function(){
        this.resize()
    },
    repHeight:/^(1|2)[0-9]{2}\.{0,1}\d{0,1}$/,
    repPhone:/^1(3|4|5|7|8)\d{9}$/,
    repBirthday:/^((2[0-9]{3})|1999)-[1-12]{1,2}-[1-31]{1,2}$/,
    repDate:/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/,
    //repDate:/^(1|2)[0-9]{3}-[1-12]{1,2}-[1-31]{1,2}$/,
    resize:function(){
        var scale = 1 / devicePixelRatio;
        document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
    },
    preload:function(imgArr,callback){
        var images = new Array();
        for(var i=0;i< imgArr.length;i++){
            images[i]=new Image();
            images[i].src=imgArr[i]
        }
        if (callback && typeof callback =="function")
            image[imgArr.length].onload=callback


    },
    addPopu:function(text,callback){
        $('body').append('<div id="sweep"> <div class="textContent"></div></div>');
        $("#sweep").height(document.body.offsetHeight);
        $('#sweep .textContent').html(text);
        $('html, body').animate({
            scrollTop: 0
        }, 300);
        //  callback && typeof callback =='function' && callback()
    },
    removePopu:function(){
        $('#sweep').remove()
    },
    getBasePath:function(){
        var url=window.location+"";
         var base_path=url.substr(0,url.indexOf("html/"));
        return base_path;
    },
    getUrlParam:function(name){
        /*获取url中的参数*/
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    },
    dateFormat:function(timstrap){
        var date=new Date(timstrap);
        var month=date.getMonth()+1;
        month=month<10?'0'+month:month;
        var year=date.getFullYear();
        var day=date.getDate();
        return year+"-"+month+"-"+day;
    }
}
var ba=new boneAge();
ba.init()
