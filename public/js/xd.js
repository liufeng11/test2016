

    var t = n = 0, count;
    $(document).ready(function(){   
        count=$("#banner_list a").length;
        $("#banner_list a:not(:first-child)").hide();
        $("#banner_info").html($("#banner_list a:first-child").find("img").attr('alt'));
        $("#banner_info").click(function(){window.open($("#banner_list a:first-child").attr('href'), "_blank")});
        $("#banner li").click(function() {
            var i = $(this).text() - 1;//获取Li元素内的值，即1，2，3，4
            n = i;
            if (i >= count) return;
            $("#banner_info").html($("#banner_list a").eq(i).find("img").attr('alt'));
            $("#banner_info").unbind().click(function(){window.open($("#banner_list a").eq(i).attr('href'), "_blank")})
            $("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(i).fadeIn(1000);
            document.getElementById("banner").style.background="";
            $(this).toggleClass("on");
            $(this).siblings().removeAttr("class");
        });
        t = setInterval("showAuto()", 1000);
        $("#banner").hover(function(){clearInterval(t)}, function(){t = setInterval("showAuto()", 1000);});
    })
    
    function showAuto()
    {
        n = n >=(count - 1) ? 0 : ++n;
        $("#banner li").eq(n).trigger('click');
    }

    

 window.onload = function() {
             var aLi = document.getElementsByTagName("li");
             var aLi = document.getElementsByClassName('navmoon');
       
           for (var i = 0; i < aLi.length; i++) {
                 //记录 aLi 的下标
                 aLi[i].index = i;
                 aLi[i].onmouseover = function() {
                      //鼠标经过一级菜单，二级菜单动画下拉显示出来
                     
                     var aUl = aLi[this.index].getElementsByClassName('erji-caidan')[0];
                      aUl.style.display = "block";
            
                  }
                  aLi[i].onmouseout = function() {
                      //鼠标离开菜单，二级菜单动画收缩起来
                    
                    var aUl = aLi[this.index].getElementsByClassName('erji-caidan')[0];
                      aUl.style.display = "none";
                 }
              }
         }


