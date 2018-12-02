/**
 * Created by user on 2017/7/19.
 */
(function ($) {
    $.fn.ajaxPagination= function (options) {
        var defaults = {
            url:'',
            data:'',
            callback: function () {
                return false;
            }
        };
        $.extend(defaults, options || {});
        if(options.url==null||options==""){
            return false;
        }

        $.ajax({
            url: options.url,
            method: "post",
            cache: false,
            async: false,
            data:options.data,
            success: function (data) {
                data = eval(data.data);
                defaults.callback(data);
            }
        });
    };
})(jQuery);