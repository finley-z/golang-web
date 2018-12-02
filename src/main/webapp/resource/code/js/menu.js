var Menu = function () {
    return {
        //初始化，指定元素，指定url，key，value键名的下拉选择框
        initMenu: function (element, menuTree,ctx) {
            var data = eval(menuTree);
            $.each(data, function (i, n) {
                var navMenu = $("<li></li>");
                if (n.level == 1) {
                    if (i == 1) {
                        navMenu.attr("class", "nav-item active");
                    } else {
                        navMenu.attr("class", "nav-item");
                    }
                    var href = $("<a></a>").attr({
                        "class": "nav-link nav-toggle",
                        "href": "javascript:;"
                    }).appendTo(navMenu);
                    var icon = $("<i></i>").attr("class", "icon-folder").appendTo(href);
                    var title = $("<span class='title'></span>").html(n.authorityName).appendTo(href);
                    var arrow = $("<span class='arrow'></span>").appendTo(href);

                    //添加子菜单
                    var subMenus = $("<ul></ul>").attr("class", "sub-menu").appendTo(navMenu);

                    $.each(data, function (j, s) {
                        if (s.level == 2&& s.parentId== n.id) {
                            var navMenu = $("<li></li>").attr("class", "nav-item").appendTo(subMenus);
                            var subIcon = $("<i class='icon-camera'></i>");
                            var subHref = $("<a></a>").attr({
                                "class": "ajaxify nav-link",
                                "href": ctx+""+s.url,
                                "menuName": s.authorityName
                            }).html(" " + s.authorityName).prepend(subIcon).appendTo(navMenu);
                        }
                    });
                }

                $("#" + element).after(navMenu);
            });
        },
        resolveToTree: function (data) {
            data = eval(data);
            var treeData = new Array();
            $.each(data, function (i, n) {
                var root = new Object();
                var root = new Object();
                root.text = n.authorityName;
                var childrenData = n.subAuthority;
                var childrenTrees = new Array();
                $.each(childrenData, function (j, s) {
                    var nodeTree = new Object();
                    nodeTree.text = s.authorityName;
                    childrenTrees.push(nodeTree);
                });
                root.children = childrenTrees;
                treeData.push(root);
            });
            return treeData;
        }
    };
}();