var url=window.location+"";
var base_path=url.substr(0,url.indexOf("html/"));
$(function(){
    function boneTest(){

    }
    boneTest.prototype={
        init:function(){
            ba.preload(['img/boy.png','img/boy.png','img/table.png']);
            this.calculate()
        },
        calculate:function(){
            var $mother=$('#mother')
            var $father=$('#father');
            var rep=/^(1|2)[0-9]{2}$/;;
            var self= this;
            $('.calculate').on('click',function(){
                if(!$father.val()||!rep.test($father.val())){
                    alert('请输入正确的父亲身高！')
                    $father.focus()
                }else if(!$mother.val()||!rep.test($mother.val())){
                    alert('请输入正确的母亲身高！');
                    $mother.focus()
                }else{
                    ba.addPopu('正在计算中...')
                   self.loadData($father.val(),$mother.val());
                }
            })
        },
        loadData:function(){
        	$.ajax({
   	   			url:base_path+"/shop/boneAge/forecastHeight",
   	   			type:"POST",
   	   			data:{'father_height':$('#father').val(),'mother_height':$('#mother').val()},
   	   			success:function(retdata){
   	   				console.log(retdata);
   	   				if(retdata.retCode=="01"){
   	   			    //获取预算数据
   	   	            var data=retdata.data;
   	   	            ba.removePopu()
   	   	            $('#son').text(data.boy_height+"cm,比同龄人"+(data.boyTan>0 ?"高":"矮")+ Math.abs(data.boyTan)+"cm")
   	   	            $('#doc').text(data.girl_height+"cm,比同龄人"+(data.girlTan>0 ?"高":"矮")+ Math.abs(data.girlTan)+"cm")
   	   				}else{
   	   					alert('计算出错！');
   	   				}
   	   			}
   	   		}) 
            
        }
    }
    var bt=new boneTest();
    bt.init()
})

