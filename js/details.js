ba.preload(['img/buyDetails.png'])
$(function(){

    order()
    function order(){
        var basePath = ba.getBasePath();
        var userId=ba.getUrlParam('user_id');
        /*从后台读取价格*/
        $.get(basePath+'shop/boneage/getBoneFee',function(data){
            if(data.status==01){
                var charge=data.data>0 ? data.data :"0";
                $('.charge').html("&yen;"+charge);
            }
        })
        $('#buy').click(function(){
            ba.addPopu('订单提交中...')
            if(userId){
                $.post(basePath+'shop/order/buyBoneAgeCheck',{user_id:userId},function(data){
                    if(data.retCode ==01){
                        var data=data.data;
                        var orderId=data.id;
                        /*$.get(basePath+'wxpay/WXBoneLaunchPay/?out_trade_no='+orderId+'&body=骨龄分析',function(data){

                        })*/
                        window.location.href = basePath+'wxpay/WXBoneLaunchPay/?out_trade_no='+orderId+'&body=骨龄分析';  
                    }
                },'json')
            }

        })
    }

})