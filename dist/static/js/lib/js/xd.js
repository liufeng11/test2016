function showAuto(){n=n>=count-1?0:++n,$("#banner li").eq(n).trigger("click")}var t=n=0,count;$(document).ready(function(){count=$("#banner_list a").length,$("#banner_list a:not(:first-child)").hide(),$("#banner_info").html($("#banner_list a:first-child").find("img").attr("alt")),$("#banner_info").click(function(){window.open($("#banner_list a:first-child").attr("href"),"_blank")}),$("#banner li").click(function(){var e=$(this).text()-1;n=e,e>=count||($("#banner_info").html($("#banner_list a").eq(e).find("img").attr("alt")),$("#banner_info").unbind().click(function(){window.open($("#banner_list a").eq(e).attr("href"),"_blank")}),$("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(e).fadeIn(1e3),document.getElementById("banner").style.background="",$(this).toggleClass("on"),$(this).siblings().removeAttr("class"))}),t=setInterval("showAuto()",1e3),$("#banner").hover(function(){clearInterval(t)},function(){t=setInterval("showAuto()",1e3)})}),window.onload=function(){for(var n=document.getElementsByTagName("li"),n=document.getElementsByClassName("navmoon"),e=0;e<n.length;e++)n[e].index=e,n[e].onmouseover=function(){var e=n[this.index].getElementsByClassName("erji-caidan")[0];e.style.display="block"},n[e].onmouseout=function(){var e=n[this.index].getElementsByClassName("erji-caidan")[0];e.style.display="none"}};