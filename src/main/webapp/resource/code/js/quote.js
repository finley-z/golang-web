/**
 * Created by 郑远锋 on 2017/6/29.
 */

//产品数据
var ProductsData;

var Quote = function () {
    return {

        //初始化报价筛选条件
        initFilter: function () {
            $.ajax({
                url: ctx + "/quote/getFilterCondition",
                method: "post",
                async: false,
                success: function (data) {
                    data = eval(data);
                    var categories = data.categories;
                    var brands = data.brands;
                    var allItemC = $("<a class='filterItem active' href='javascript:;' data=''>不限</a>");
                    var allItemB = $("<a class='filterItem active' href='javascript:;' data=''>不限</a>");
                    var CateWrapper = $("#category").html("").append(allItemC);
                    var BrandWrapper = $("#brand").html("").append(allItemB);
                    $.each(categories, function (index, item) {
                        var filterItem = $("<a class='filterItem' href='javascript:;'></a>").text(item.categoryName).attr("data", item.categoryId).appendTo(CateWrapper);
                    });
                    $.each(brands, function (index, item) {
                        var filterItem = $("<a class='filterItem' href='javascript:;'></a>").text(item.brandName).attr("data", item.brandId).appendTo(BrandWrapper);
                    });
                }
            })
        },
        //初始化产品页面展示
        initView: function () {
            Quote.getProductsData(true);
            Quote.drawView();
        },
        //条件筛选产品
        getProductsData: function (generate) {
            var category = $("#category").find(".active").attr("data");
            var brand = $("#brand").find(".active").attr("data");
            var price = $("#price").find(".active").attr("data");
            var keyword = $("#keyword").val();
            $.ajax({
                url: ctx + "/quote/products",
                method: "post",
                data: {
                    productType: category,
                    productBrand: brand,
                    priceLevel: price,
                    productName: keyword,
                    startRow:startRow,
                    rows:rows
                },
                cache: false,
                async: false,
                success: function (data) {
                    data=eval(data);
                    $(".total").text(Math.ceil(parseFloat(data.recordsTotal) / limit));
                    var curr_val= parseInt($(".current").text());
                    if(curr_val==0&&data.recordsTotal>0){
                        $(".current").text("1");
                    }
                    ProductsData = data.data;
                    if(generate){
                        $('.pagination-wrapper').extendPagination({
                            totalCount: data.recordsTotal,
                            showPage: 5,
                            limit: limit,
                            callback: function (curr, limit, totalCount) {
                                $(".current").text(curr);

                                startRow=(curr-1)*limit;
                                rows=curr*limit;
                                Quote.getProductsData(false);
                                Quote.drawView();
                            }
                        });
                    }
                  ;
                }
            })
        },
        //列表展示产品
        showList: function () {
            var container = $("#resultTab").html("");
            var table = $("<table class='table table-bordered table-hover'></table>").appendTo(container);
            $.each(ProductsData, function (index, item) {
                var tr = $("<tr></tr>").appendTo(table);
                var href;
                var imageSrc=ctx+"/file/showPicture/"+item.mainImage;
                if(item.mainImage!=null&&item.mainImage!=undefined){
                    href = $("<a class='picture-popover' data-container='body' data-trigger='hover' data-toggle='popover' data-placement='auto' data-html='true'></a>").
                        attr("href",ctx + "/quote/productDetail/" + item.productId).attr("data-content","<img width='200' height='220' src='"+imageSrc+"'/>").
                        popover().html(item.productName + "<span class='badge picture-badage'>图</span>");
                }else{
                    href = $("<a></a>").text(item.productName).attr("href",ctx + "/quote/productDetail/" + item.productId);
                }

                var nameTd = $("<td></td>").append(href).appendTo(tr);
                var remarkTd = $("<td></td>").text(item.productBrandName).appendTo(tr);
                var quoteTd = $("<td></td>").appendTo(tr);
                var quoteDiv = $("<div></div>").appendTo(quoteTd);

                $.each(item.quoteConfigs, function (i, n) {
                    var quoteDesc = Dictionary.getDictName("color", n.productColor) + " " + n.romCapacity + "G";
                    var quoteItem = $("<span class='quote-item' data-container='body' data-trigger='click' data-placement='auto' data-content='&nbsp;' data-toggle='popover' data-html='true'></span>")
                        .attr("image",imageSrc).attr("productName",item.productName+" "+quoteDesc).attr("quote-price", n.productPrice).attr("quote-id", n.configId).popover().appendTo(quoteDiv);
                    var desc=$("<span class='quote-desc'>"+quoteDesc+"</span> : <span class='quote-price'><i class='fa fa-yen'></i>"+n.productPrice+"</span>").appendTo(quoteItem);

                });
            });
        },
        //图文产品展示
        showPicture: function () {
            var container = $("#resultTab").html("");
            var rowlist, count = 0;
            $.each(ProductsData, function (index, item) {
                $.each(item.quoteConfigs, function (i, n) {
                    if (count % 4 == 0) {
                        rowlist = $("<div class='row product-list'></div>").appendTo(container);
                    }
                    var productWrapper = $("<div class='col-md-3 col-sm-4 col-xs-12'></div>").appendTo(rowlist);
                    var productItem = $(" <div class='product-item'></div>").appendTo(productWrapper);
                    var pictureWrapper = $("<div class='pi-img-wrapper'>").appendTo(productItem);
                    var imgSrc = item.mainImage;
                    var picture = $("<img  class='img-responsive'/>").appendTo(pictureWrapper);
                    if (imgSrc != null && imgSrc != undefined) {
                        picture.attr("src", ctx + "/file/showPicture/" + imgSrc);
                    } else {
                        picture.attr("src", ctx + "/resource/assets/frontend/pages/img/nopicture.jpg");
                    }
                    var productDesc = $("<h3></h3>").appendTo(productItem);
                    var productName = item.productName + " " + Dictionary.getDictName("color", n.productColor) + " " + n.romCapacity + "G";
                    var productHref = $("<a></a>").text(productName).attr("href", ctx + "/quote/productDetail/" + item.productId).appendTo(productDesc);
                    var price = $("<div class='pi-price'></div>").html("<strong><i class='fa fa-yen'></i> " + n.productPrice + "</strong>").appendTo(productItem);
                    var btn =  $("<a href='javascript:;' class='quote-item btn btn-default add2cart' data-container='body' data-trigger='click'" +
                        " data-placement='auto' data-content='&nbsp;' data-toggle='popover' data-html='true'>加入购物车</a>")
                        .attr("image",ctx + "/file/showPicture/" + imgSrc).attr("productName",productName).
                        attr("quote-price", n.productPrice).attr("quote-id", n.configId).popover().appendTo(productItem);

                    count++;
                });
            });

        },
        //绘制产品视图
        drawView: function () {
            var viewMode = $(".d_active").attr("data");
            if (viewMode == 1) {
                Quote.showList();
            } else if (viewMode == 2) {
                Quote.showPicture();
            }
        },
        //绑定事件
        bindEvent: function () {

            //条件筛选产品
            $(document).on('click', "#filterTable .filterItem", function () {
                //添加数据设置遮罩层
                Quote.mask();
                var currentFilterTab = $(this).parent(".filterTab");
                currentFilterTab.find(".filterItem").removeClass("active");
                $(this).addClass("active");
                $(".current").text("0");
                Quote.getProductsData(true);
                Quote.drawView();
                //解除遮罩层
                Quote.unmask();
            });

            //条件筛选产品
            $(".searchBtn").click(function () {
                //添加数据设置遮罩层
                Quote.mask();
                $(".current").text("0");
                Quote.getProductsData(true);

                Quote.drawView();
                //解除遮罩层
                Quote.unmask();
            });

            //切换显示模式
            $(".displaymode").click(function () {
                //添加数据设置遮罩层
                Quote.mask();
                $(".displaymode").removeClass("d_active");
                $(this).addClass("d_active");
                Quote.drawView();
                //解除遮罩层
                Quote.unmask();
            });

            //添加至购物车
            $(document).on('click', ".addToCart", function () {
                $.ajax({
                    url: ctx + "/trade/addShopCart",
                    method: "post",
                    data: $(this).parents(".shopCartForm").serialize(),
                    cache: false,
                    async: false,
                    success: function (data) {
                        data = eval(data);
                    }
                })
            });
        },
        mask: function () {
            App.blockUI({
                message: "加载中....",
                target: $("#resultTab"),
                overlayColor: 'none',
                cenrerY: true,
                boxed: true
            });
        },

        unmask: function () {
            App.unblockUI($("#resultTab"));
        }
    };
}();

jQuery(document).ready(function () {
    Quote.initFilter();
    Quote.bindEvent();
    Quote.initView();
});