$(function () {
    function upload() {

    }

    upload.prototype = {
        init: function () {
            this.type = ba.getUrlParam('type');//type=0上传 type=1编辑
            this.upload();
            this.type == 1 && this.getData();
            this.submit();
        },
        $father: $('#father'),
        $mother: $('#mother'),
        $name: $('#son-name'),
        $gender: $('#gender'),
        $rayDate: $("#date-X-ray"),
        $nowHeight: $('#now-height'),
        $birthday: $('#birthday'),
        $phone: $('#phone'),
        $fileString: {},
        maxSize:4000,//图片上传最大尺寸 4M
        upload: function () {
            var self = this;
            var file = $('#upload-file');
            var sizeAllow=true;

            file.change(function () {
                var files = this.files[0]
                //var  type=this.value;
                /*限制图片格式为 jpg, png*/
                if (files.type.indexOf('jpeg') == "-1" && files.type.indexOf('png') == "-1") {
                    self.popup('请上传JPG或PNG格式',2000)
                }else if (files.size > self.maxSize*1024) {
                    self.popup('请上传4M以内图片',2000)
                } else {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var src = this.result;
                        $('.upload-up').hide();
                        $('#img-content').show();
                        $('#img-content .img-show').css('background-image', "url(" + src + ")");

                        self.$fileString.uploadURL = src
                        self.$fileString.uploadDate = ba.dateFormat(files.lastModified)


                    }
                    reader.readAsDataURL(files);
                }

            })

            $('#img-content .img-show').on('click', function (e) {
                e.stopPropagation();

                if (e.target == $("#close-btn")[0] || e.target == $(".close")[0]) {
                    $('#img-content').hide();
                    $('.upload-up').show();

                    self.$fileString.uploadURL = ""
                    self.$fileString.uploadDate = ""
                } else {
                    var src = self.$fileString.uploadURL ? self.$fileString.uploadURL : self.popupSrc
                    ba.addPopu('<img src="' + src + '" style="width:100%;"/>');
                    $('.textContent').css({
                        width: "100%", background: "none", 'left': "0", "top": "20%", "position": "absolute"
                    });

                }
                $('#sweep').on('click', function (event) {
                    event.stopPropagation();
                    if (event.target == $('#sweep img')[0])
                        ba.removePopu()
                })
            })

        }
        ,
        popup:function(text,time){
            ba.addPopu(text);
            time=time ? time:2000;
            //$('#sweep .textContent').css('top',"25%")
            window.setTimeout(function(){
                ba.removePopu();
            },time)

        },
        getData: function () {
            var self = this;
            var service_id = ba.getUrlParam('server_id');
            var basePath = ba.getBasePath();
            var url = basePath + "shop/boneAge/getWorkInfo?serve_id=" + service_id;
            $.get(url, function (data) {
                if (data.retCode == '01') {
                    var data = data.data;
                    if (data.image_url) {
                        $('.upload-up').hide();
                        $('#img-content').show();
                        $('#img-content .img-show').css('background-image', "url(" + data.image_url + ")");
                        self.popupSrc = data.image_url;
                    }
                    self.$fileString.imageId = data.pic_id;
                    self.$fileString.uploadURL = data.image_url;
                    self.$fileString.uploadDate = data.pic_date;
                    self.$father.val(data.father_height);
                    self.$mother.val(data.mother_height);
                    self.$name.val(data.name);
                    self.$gender.val(data.sex);
                    self.$rayDate.val(data.pic_date);
                    self.$nowHeight.val(data.height);
                    self.$birthday.val(data.birth_date);
                    self.$phone.val(data.mobile);
                    self.work_id = data.id;
                }

            })
        }
        ,
        submit: function () {
            var self = this;
            $('#submit').click(function () {
                console.log($("#upload-file")[0].files[0]);
                if (!$("#upload-file")[0].files[0]) {
                    if (self.type == 1) {
                        self.popup("请重新上传骨龄片！")
                    } else {
                        self.popup('请上传骨龄片！')

                    }
                } else if (!ba.repHeight.test(self.$father.val()) || Math.floor(self.$father.val())>300) {

                    self.popup('请输入父亲身高，精确到小数点后一位！')

                    //self.$father.focus();

                } else if (!ba.repHeight.test(self.$mother.val()) || Math.floor(self.$mother.val())>300) {
                    //self.$mother.focus();
                    self.popup('请输入母亲身高，精确到小数点后一位！');

                } else if (!self.$name.val()) {
                    //self.$name.focus();
                    self.popup('请输入孩子姓名！',"","30%")
                } else if (!self.$gender.val()) {
                    self.popup('请选择孩子性别！')
                } else if (!ba.repDate.test(self.$rayDate.val())) {
                    //self.$rayDate.focus();
                    self.popup('请输入3个月之内的拍片日期！')

                } else if (!self.validate(self.$rayDate.val())) {
                    //self.$rayDate.focus();
                    self.popup('请输入3个月之内的拍片日期！')
                } else if (!self.$nowHeight.val() || Math.floor(self.$nowHeight.val())>300) {
                    //self.$nowHeight.focus();
                    self.popup('请输入孩子身高，精确到小数点后一位！' )
                } else if (!ba.repDate.test(self.$birthday.val())) {
                    //self.$birthday.focus();
                    self.popup('请输入孩子出生日期！')

                } else if (!self.validate(self.$birthday.val()) && !self.validateBirth(self.$birthday.val())) {
                    //self.$birthday.focus();
                    self.popup('孩子年龄必须在3~18岁之内！')

                } else if (!ba.repPhone.test(self.$phone.val())) {
                    //self.$phone.focus();
                    self.popup('请输正确的手机号码！')
                } else {

                    var basePath = ba.getBasePath();
                    var server_id = ba.getUrlParam('server_id');
                    var shop_user_id = ba.getUrlParam('shop_user_id');

                    var url = self.type == 0 ? basePath + "shop/boneAge/uploadBoneAgeInfo" : basePath + "shop/boneAge/updateBoneAgeInfo";
                    var formData = new FormData()
                    formData.append('server_id', server_id);
                    formData.append(' shop_user_id', shop_user_id);
                    formData.append('pic_date', self.$rayDate.val());
                    formData.append('name', self.$name.val());
                    formData.append('father_height', self.$father.val());
                    formData.append('mother_height', self.$mother.val());
                    formData.append('sex', self.$gender.val());
                    formData.append('birth_date', self.$birthday.val());
                    formData.append('height', self.$nowHeight.val());
                    formData.append('mobile', self.$phone.val());
                    formData.append('imgFile', $("#upload-file")[0].files[0]);
                    formData.append('image_id', self.$fileString.imageId);
                    formData.append('work_id', self.work_id);

                    ba.addPopu('正在跳转...');
                    var options = {
                        type: "POST",
                        data: formData,
                        url: url,
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data.statusInfo.statusCode == "001") {
                                window.location.href = basePath + "html/store/html/order/order21.html?userId=" + shop_user_id + "&serverIndex=0";
                            }
                        }
                    }
                    self.ajax(options)

                    //$.ajax({
                    //    url: url,
                    //    type: "POST",
                    //    data: formData,
                    //    async:false,
                    //    processData: false,
                    //    contentType: false,
                    //    success: function (data) {
                    //
                    //        if (data.statusInfo.statusCode == 001) {
                    //
                    //            window.location.href = basePath+"html/store/html/order/order21.html?userId="+shop_user_id+"&serverIndex=0";
                    //        }
                    //    }
                    //})
                }
            })
        }
        ,
        validate: function (date) {
            var dateStamp = Date.parse(date);
            var timestamp = Date.parse(new Date());
            var yearNow=new Date().getFullYear();
            var yearBe=new Date(dateStamp).getFullYear();
            var monthNow=new Date().getMonth()+1;
            var monthP=new Date(dateStamp).getMonth()+1;
            var Tb=false;
            if(monthNow-monthP<0){
                Tb=yearNow==yearBe-1&&monthNow+12-monthP<3
            }else{
                Tb=yearNow==yearBe&&monthNow-monthP<3
            }

            if (dateStamp > timestamp || !Tb) {
                return false
            } else {
                return true
            }

        }
        ,
        ajax: function (options) {
            options = options || {};
            options.type = (options.type || "GET").toUpperCase();

            //options.dataType = options.dataType || "json";
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    if (status >= 200 && status < 300) {
                        options.success && options.success(xhr.responseText, xhr.responseXML);

                    } else {
                        options.fail && options.fail(status);
                    }
                }
            }
            if (options.type == "POST") {
                xhr.open("POST", options.url, false);
                //设置表单提交时的内容类型  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(options.data);
            }
        },
        validateBirth: function (date) {
            var date = date.split('-');
            var now = new Date();
            if ((now.getFullYear() - date[0]) < 18 && (now.getFullYear() - date[0]) > 0 &&(now.getFullYear() - date[0]) > 3) {
                return true
            } else {
                return false;
            }
        }
    }
    var up = new upload()
    up.init();
})
