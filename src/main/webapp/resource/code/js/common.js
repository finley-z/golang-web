/*
 * 常用工具类
 */
var Common = function () {
    return {
        //初始化，指定元素，指定url，key，value键名的下拉选择框
        initSelector: function (url, element, keyField, valueField) {
            $.ajax({
                url: url,
                type: "post",
                async: false,
                success: function (data) {
                    $("#" + element).html("<option value=''>---请选择---</option>");
                    data = eval(data);
                    $.each(data, function (i, n) {
                        var itemElement = $("<option></option>");
                        var item = n;
                        for (var _key in item) {
                            if (_key == keyField) {
                                itemElement.html(item[_key]);
                            }
                            if (_key == valueField) {
                                itemElement.val(item[_key]);
                            }
                        }
                        $("#" + element).append(itemElement);
                    });
                }
            })
        },
        initFancybox: function () {
            if (!jQuery.fancybox) {
                return;
            }
            jQuery(".fancybox-fast-view").fancybox();

            if (jQuery(".fancybox-button").size() > 0) {
                jQuery(".fancybox-button").fancybox({
                    groupAttr: 'data-rel',
                    prevEffect: 'none',
                    nextEffect: 'none',
                    closeBtn: true,
                    helpers: {
                        title: {
                            type: 'inside'
                        }
                    }
                });

                $('.fancybox-video').fancybox({
                    type: 'iframe'
                });
            }
        }
    };
}();

/*
 *  时间戳转换工具类
 */
var TimerUtil = function () {
    return {
        transFormDate: function (timestamp, fmt) {
            if (timestamp == null || timestamp == undefined || "" == timestamp) {
                return "";
            }
            if (fmt == null || fmt == undefined || "" == fmt) {
                fmt = "yyyy-MM-dd HH:mm:ss";
            }
            var date = new Date(parseInt(timestamp));
            var year = date.getFullYear();//当前年份
            var month = date.getMonth();//当前月份
            var data = date.getDate();//天
            var hours = date.getHours();//小时
            var minute = date.getMinutes();//分
            var second = date.getSeconds();//秒
            if (fmt == "yyyy年MM月dd日 HH时mm分ss秒") {
                return year + "年" + TimerUtil.twoSize((month + 1)) + "月" + TimerUtil.twoSize(data) + "日 " + TimerUtil.twoSize(hours) + "时" + TimerUtil.twoSize(minute) + "分" + TimerUtil.twoSize(second) + "秒";
            } else if (fmt == "yyyy-MM-dd HH:mm:ss") {
                return year + "-" + TimerUtil.twoSize((month + 1)) + "-" + TimerUtil.twoSize(data) + " " + TimerUtil.twoSize(hours) + ":" + TimerUtil.twoSize(minute) + ":" + TimerUtil.twoSize(second);
            } else if (fmt == "yyyy年MM月dd日") {
                return year + "年" + TimerUtil.twoSize((month + 1)) + "月" + TimerUtil.twoSize(data) + "日 " + TimerUtil.twoSize(hours);
            } else if (fmt == "MM月dd") {
                return TimerUtil.twoSize((month + 1)) + "月" + TimerUtil.twoSize(data);
            } else if (fmt == "HH：mm") {
                return TimerUtil.twoSize(hours) + ":" + TimerUtil.twoSize(minute)
            } else if (fmt == "HH:mm") {
                return TimerUtil.twoSize(hours) + ":" + TimerUtil.twoSize(minute)
            } else {
                return year + "-" + TimerUtil.twoSize((month + 1)) + "-" + TimerUtil.twoSize(data) + " " + TimerUtil.twoSize(hours) + ":" + TimerUtil.twoSize(minute) + ":" + TimerUtil.twoSize(second);
            }
        },
        //  时间一位数字在前面补0
        twoSize: function (number) {
            number = number + "";
            if (number.length == 1) {
                return "0" + number;
            } else {
                return number;
            }
        },
        initDatePicker:function(){
            var date =new Date();
            var start=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
            var now=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            $("#startDate").val(start);
            $("#endDate").val(now);
            $("#startDatePicker").val(start);
            $("#endDatePicker").val(now);
        }
    };
}();


/*
 *  Cookie工具类
 */
var CookieUtil = function () {
    return {
        //获取cookie
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            }
            else {
                return null;
            }
        }
    };
}();

/*
 *
 * 树形操作工具类
 */
var TreeUtil = function () {
    return {
        //获取树的选中节点
        getSelected: function (tree) {
            var treeId = "#" + tree;
            var selectedIds = new Array();
            var nodes = $(treeId).jstree("get_checked"); //使用get_checked方法
            $.each(nodes, function (i, n) {
                selectedIds.push(n);
            });
            return selectedIds;
        },
        //将json数据转换成符合tree格式的数据
        resolveToTree: function (data) {
            data = eval(data);
            var treeData = new Array();
            $.each(data, function (i, n) {
                var root = new Object();
                root.id = n.id;
                root.text = n.authorityName;
                root.state = {opened: !0};
                var childrenData = n.subAuthority;
                var childrenTrees = new Array();
                $.each(childrenData, function (j, s) {
                    var nodeTree = new Object();
                    nodeTree.id = s.id;
                    nodeTree.text = s.authorityName;
                    childrenTrees.push(nodeTree);
                });
                root.children = childrenTrees;
                treeData.push(root);
            });
            return treeData;
        },
        //生成树结构
        generateTree: function (url, tree) {
            var treeId = "#" + tree;
            var treeData;
            $.ajax({
                url: url,
                type: "post",
                async: false,
                cache: false,
                success: function (data) {
                    treeData = TreeUtil.resolveToTree(data);
                }
            })
            //生成权限树
            $(treeId).jstree({
                plugins: ["wholerow", "checkbox", "types"],
                core: {
                    themes: {responsive: !1},
                    data: treeData
                },
                types: {
                    "default": {icon: "fa fa-folder icon-state-warning icon-lg"},
                    file: {icon: "fa fa-file icon-state-warning icon-lg"}
                }
            })
        }
    };
}();


/*
 *  Form表单工具类
 */
var Form = function () {
    return {
        //将数据映射到表单当中;
        load: function (form, data) {
            var formId = "#" + form;
            var loadSuccess = true;
            if (typeof data == 'string') {
                $.ajax({
                    cache: false,
                    url: data,
                    data: {},
                    dataType: 'json',
                    success: function (data) {
                        Form._load(formId, data);
                    },
                    error: function () {
                        loadSuccess = false;
                        return loadSuccess;
                    }
                });
            } else {
                Form._load(formId, data);
            }
        },
        _load: function (form, data) {
            var form = $(form);
            for (var name in data) {
                var val = data[name];
                var rr = Form._checkField(form, name, val);
                if (!rr.length) {
                    var count = 0;
                    if (!count) {
                        $('input[name="' + name + '"]', form).val(val);
                        $('textarea[name="' + name + '"]', form).val(val);
                        $('select[name="' + name + '"]', form).val(val);
                    }
                }
            }
        },
        _checkField: function (form, name, val) {
            var rr = form.find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
            rr.prop('checked', false);
            rr.each(function () {
                var f = $(this);
                if (f.val() == String(val) || $.inArray(f.val(), $.isArray(val) ? val : [val]) >= 0) {
                    f.prop('checked', true);
                }
            });
            return rr;
        },
        clear: function (form) {
            $("#" + form + " input,select,textarea").each(function () {
                var t = this.type, tag = this.tagName.toLowerCase();
                if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea') {
                    this.value = '';
                } else if (t == 'checkbox' || t == 'radio') {
                    this.checked = false;
                } else if (tag == 'select') {
                    this.selectedIndex = 0;
                }
            });
        }
    };
}();
/*
 *  Table数据表格工具类
 */
var Table = function () {
    return {
        //获取选中行数据;
        getSelected: function (table) {
            var data = table.rows('.selected').data();
            return data[0];
        },
        getRows: function (table) {
            return table.rows('.selected').data();
        },
        getSelectId: function (table) {
            var ids = new Array();
            var selectedRows = table.rows('.selected').nodes();
            $(selectedRows).each(function () {
                var checkbox = $(this).find(".checkboxes");
                ids.push(checkbox.val());
            });
            return ids[0];
        },
        getSelectIds: function (table) {
            var ids = new Array();
            var selectedRows = table.rows('.selected').nodes();
            $(selectedRows).each(function () {
                var checkbox = $(this).find(".checkboxes");
                ids.push(checkbox.val());
            });
            return ids;
        },
        reload: function (table) {
            table.ajax.reload();
        },

        init: function () {
            //绑定全选按钮事件，全选所有checkbox，并且让数据行为selected状态
            $(document).on('change', "table .group-checkable", function () {
                var checked = jQuery(this).is(":checked");
                $(this).parents("table").find(".checkboxes").each(function () {
                    if (checked) {
                        $(this).prop("checked", true);
                        $(this).parents('tr').addClass("selected");
                    } else {
                        $(this).prop("checked", false);
                        $(this).parents('tr').removeClass("selected");
                    }
                });
            });
            //绑定checkbox按钮事件，让数据行为selected状态
            $(document).on('change', "tbody tr td .checkboxes", function () {
                //当前checkbox的选中状态
                var checked = jQuery(this).is(":checked");
                if (checked) {
                    $(this).parents('tr').addClass("selected");
                } else {
                    $(this).parents('tr').removeClass("selected");
                }
            });

            //绑定tr点击事件，让数据行为selected状态，同时让checkbox选中状态改变
            $(document).on('click', "tbody tr", function (event) {
                var subElement = $(event.target).get(0).tagName;
                if (subElement != 'TD' && subElement != 'td' && subElement != 'tr' && subElement != 'TR') {
                    return;
                }
                $(this).toggleClass("selected");
                var selected = $(this).hasClass("selected");
                $(this).find(".checkboxes").prop("checked", selected);

            })
        }
    };
}();
var dictionaryData=undefined;
var Dictionary = function () {
    return {
        //初始化字典数据
        init: function () {
            if(dictionaryData==undefined){
                $.ajax({
                    url: ctx + "/dictionary/getDictionaryMap",
                    method: "post",
                    async:false,
                    success: function (data) {
                        dictionaryData = eval(data);
                    }
                })
            }
        },
        getDictName: function (typeCode, keyAttr) {
            var dictionaries = dictionaryData[typeCode];
            //字典对应的名称
            var dictionaryName;
            $.each(dictionaries, function (index, item) {
                var key = item["key"];
                if (key == keyAttr) {
                    dictionaryName = item["value"];
                }
            });
            return dictionaryName;
        }
    };
}();
var ImageUtil = function () {
    return {
        //初始化字典数据
        init: function () {
            $(document).on('click', ".product-other-images a", function (event) {
                $(this).addClass("active");
                var src=$(this).find("img").attr("src");
                $("#mainImage").attr("src",src);
            });
            $("#mainImage").find("a").removeClass("active");
        }
    };
}();


var ShopCart = function () {
    return {
        //初始化字典数据
        countShopCart: function () {
            $.ajax({
                url: ctx + "/trade/countShopCart",
                method: "post",
                async:false,
                success: function (data) {
                    $("#shopCartCount").text(data);
                }
            })
        }
    };
}();

var Order = function () {
    return {
        //初始化字典数据
        formatterStatus: function (status) {
            if(status==0){
                return "待付款";
            }
            if(status==1){
                return "已付款";
            }
            if(status==2){
                return "待发货";
            }
            if(status==3){
                return "已发货";
            }
            if(status==4){
                return "交易完成";
            }
            if(status==5){
                return "交易取消";
            }
        }
    };
}();

var Notice = function () {
    return {
        //初始化字典数据
        generateNoticeList: function (type) {
            var container=$(".notice-container").html("");
            $.ajax({
                url: ctx+"/notice/noticeRead",
                type: "post",
                async: false,
                success: function (data) {
                    data = eval(data);
                    $(".total-notice").text(data.total);
                    $.each(data.notices, function (index, item) {
                        var li=$("<li></li>").appendTo(container);
                        var a;
                        if(type==1){
                            //前端
                            a=$("<a></a>").attr("href",ctx+"/notice/frontedDetail?noticeId="+item.noticeId).appendTo(li);
                        }else if(type==2){
                            a=$("<a href='javascript:;' class='notice-item'></a>").attr("data-href",ctx+"/notice/backDetail?goback=no&noticeId="+item.noticeId).appendTo(li);
                        }
                        var time=$("<span class='time'></span>").text(TimerUtil.transFormDate(item.createTime)).appendTo(a);
                        var detail=$("<span class='details'><span class='label label-sm label-icon label-success'>" +
                            "<i class='fa fa-bell-o'></i></span>"+item.noticeTitle+"</span>").appendTo(a);
                    });
                }
            });
        },
        generateNoticeListTab:function(type){
            var container=$(".notice-list");
            $.ajax({
                url: ctx+"/notice/noticeList",
                type: "post",
                async: false,
                success: function (data) {
                    data = eval(data);
                    //$(".total-notice").text(data.total);
                    $.each(data.data, function (index, item) {
                        var comment=$("<div class='mt-comment'></div>").appendTo(container);
                        var commentImage=$("<div class='mt-comment-img'></div>").appendTo(comment);
                        var Image=$("<img src='"+ctx+"/resource/assets/frontend/layout/img/email.jpg"+"'/>").appendTo(commentImage);
                        var commentBody=$("<div class='mt-comment-body'></div>").appendTo(comment);
                        var commentInfo=$("<div class='mt-comment-info'></div>").appendTo(commentBody);
                        var author=$("<span class='mt-comment-author'></span>").text("").appendTo(commentInfo);
                        var date=$("<span class='mt-comment-date'></span>").text(TimerUtil.transFormDate(item.createTime)).appendTo(commentInfo);
                        var commentText=$("<div class='mt-comment-text'></div>").appendTo(commentBody);
                        var href;
                        if(type==1){
                            //前端
                             href=$("<a></a>").attr("href",ctx+"/notice/frontedDetail?noticeId="+item.noticeId).text(item.noticeTitle).appendTo(commentText);
                        }else if(type==2){
                             href=$("<a href='javascript:;' class='notice-item'></a>").attr("data-href",ctx+"/notice/backDetail?goback=no&noticeId="+item.noticeId).text(item.noticeTitle).appendTo(commentText);
                        }
                        var commentDetail=$("<div class='mt-comment-details'></div>").appendTo(commentBody);
                    });
                }
            });
        }
    };
}();
jQuery(document).ready(function () {
    Table.init();
    Dictionary.init();
    ImageUtil.init();
    //Common.initFancybox();
});