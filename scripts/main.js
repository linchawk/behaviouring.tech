//Site loader script

;(function(){
  function id(v){ return document.getElementById(v); }
  function loadbar() {
    var ovrl = id("progress-overlay"),
        prog = id("progress"),
        stat = id("progstat"),
        img = document.images,
        c = 0,
        tot = img.length;
    if(tot == 0) return doneLoading();

    function imgLoaded(){
      c += 1;
      var perc = ((100/tot*c) << 0) +"%";
      prog.style.width = perc;
      stat.innerHTML = "Loading "+ perc;
      if(c===tot) return doneLoading();
    }
    function doneLoading(){
      ovrl.style.opacity = 0;
      setTimeout(function(){ 
        ovrl.style.display = "none";
      }, 1200);
    }
    for(var i=0; i<tot; i++) {
      var tImg     = new Image();
      tImg.onload  = imgLoaded;
      tImg.onerror = imgLoaded;
      tImg.src     = img[i].src;
    }    
  }
  document.addEventListener('DOMContentLoaded', loadbar, false);
}());


function loadPage(page) {
	window.location.hash = page;
}

function centerCircleImages(parent) {
    var circleImgCollection;
    if (typeof parent !== "undefined") {
        jQuery(parent).find(".circle-border").each(function () {
            var circleImgHeight = jQuery(this).height();
            var textHeight = jQuery(this).next().height();
            if (textHeight > circleImgHeight) {
                var topMargin = Math.round((textHeight - circleImgHeight) / 2);
                topMargin -= 5; //Adjust the padding-top of circle images;
                jQuery(this).css({ "margin-top": topMargin + "px" });
            }
        });
    }
    else {
        jQuery(".circle-border").each(function () {
            var circleImgHeight = jQuery(this).height();
            var textHeight = jQuery(this).next().height();
            if (textHeight > circleImgHeight) {
                var topMargin = Math.round((textHeight - circleImgHeight) / 2);
                topMargin -= 5; //Adjust the padding-top of circle images;
                jQuery(this).css({ "margin-top": topMargin + "px" });
            }
        });
    }           
}

function getHashAndLoadPage(isPageLoad) {
	var requestedPage = location.hash.replace("#","").trim();	
	var currentActivePage = jQuery(".page-active").attr("rel");

    if(requestedPage == "blog") //Get the blog titles if the current page is blog
        getBlogTitles();
    else if(requestedPage.indexOf("blog/") >= 0) { //Get the blog content by title
        var blogTitle = requestedPage.substring(requestedPage.indexOf("/") + 1);
        requestedPage = "blog";
        getBlogByTitle(blogTitle);
    }

	if(location.hash == "") {
		if(!isPageLoad) {
			jQuery("#page-" + currentActivePage).removeClass("page-active");
			jQuery("#page-" + currentActivePage).fadeOut();
			jQuery("#page-home").addClass("page-active");
			jQuery("#page-home" + requestedPage).fadeIn();			
		}		
	}
	else {
		jQuery("#page-" + currentActivePage).removeClass("page-active");
		jQuery("#page-" + currentActivePage).fadeOut();
		jQuery("#page-" + requestedPage).addClass("page-active");
		jQuery("#page-" + requestedPage).fadeIn();
	}
	
	centerCircleImages(); //Center the circle images in the loaded page
	adjustTopNavWidth(requestedPage); // Adjust top nav width according to scroll bar width    	
}

function getBlogTitles() {
    var requestURL = "http://behaviouring.tech/get_blogtitles.php";
    jQuery.ajax({
        url: requestURL, 
        dataType: "json",        
        success: function(result){
            var outHTML = "";
            if(result.titles.length > 0) {
                jQuery(result.titles).each(function(index, element) {
                    outHTML +=   '<p class="margin-top-10px">' + 
                                '<a href="/#blog/' + encodeURIComponent(element) + '" class="link-color-white">' + element + '</a></p>';
                });
                jQuery("#page-blog .page-content").html(outHTML);
                adjustTopNavWidth("blog");
            }            
        }
    });

}

function getBlogByTitle(blogTitle) {    
    var requestURL = "http://behaviouring.tech/get_blogbytitle.php?title=" + blogTitle;
    jQuery("#page-blog .page-content").html('<p class="margin-top-10px"> Fetching blog: ' + blogTitle + '</p>');
    jQuery.ajax({
        url: requestURL, 
        dataType: "json",        
        success: function(result){
            var outHTML = "";
            if(result.blog.length > 0) {
                jQuery(result.blog).each(function(index, element) {
                    outHTML =   '<div class="illustrate-content">' +
                                '<b>' + element.title + '</b>' +                                                                                               
                                '<p class="margin-top-10px">' + element.date + '</p>' + 
                                '<p class="margin-top-10px">' + element.content + '</p>' + 
                                '</div>';
                });
                jQuery("#page-blog .page-content").html(outHTML);
                adjustTopNavWidth("blog");
            }            
        }
    });

}

function isScrollBarVisible(page) {
   if(page) {
	   var $page = jQuery("#page-" + page + " .page-inner");
	   if($page)
	   	return $page.get(0).scrollHeight > $page.height();
	   else
	   	return false;
   }
   else {
   	return false;
   }
}

function getScrollBarWidth() {
    var $outer = jQuery('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
        widthWithScroll = jQuery('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
    $outer.remove();
    return 100 - widthWithScroll;
}

function adjustTopNavWidth(page) {
   // Dirty fix for the nav bar hiding the scroll bar issue
   jQuery("#top-nav").css({"width": "100%"});
   if(isScrollBarVisible(page))
   	jQuery("#top-nav").width(jQuery("#top-nav").width() - getScrollBarWidth());
}

jQuery(window).load(function() {
	getHashAndLoadPage(true);
});

window.onhashchange = function() {	
	getHashAndLoadPage(false);			
};

jQuery(document).ready(function () { 
    adjustTopNavWidth('home');       
    jQuery("#site-title").click(function () {
        window.location.hash = "home";
    });

    jQuery("#work-paging-prev").click(function () {
        var workItemsList = jQuery(".work-items");
        var workItemActive = jQuery(".work-item-active");

        if (jQuery(workItemActive).prev().length) {

            jQuery(workItemActive).prev().css({ "margin-left": "-1000px" }).removeClass("hide");
            centerCircleImages(jQuery(workItemActive).prev());
            jQuery(workItemActive).animate({ "margin-left": "2000px" }, 800, "easeInBack", function () {
                jQuery(this).removeClass("work-item-active").addClass("hide");
            });

            jQuery(workItemActive).prev().animate({ "margin-left": "0px" }, 800, "easeInOutQuart", function () {
                jQuery(this).addClass("work-item-active");
                if (jQuery(this).next().attr("rel") == "last")
                    jQuery("#work-paging-next").fadeIn();
                if (jQuery(this).attr("rel") == "first")
                    jQuery("#work-paging-prev").fadeOut();
            });
        }
        else
            jQuery("#work-paging-prev").fadeOut();
    });

    jQuery("#work-paging-next").click(function () {
        var workItemsList = jQuery(".work-items");
        var workItemActive = jQuery(".work-item-active");

        if (jQuery(workItemActive).next().length) {

            jQuery(workItemActive).next().css({ "margin-left": "1000px" }).removeClass("hide");
            centerCircleImages(jQuery(workItemActive).next());
            jQuery(workItemActive).animate({ "margin-left": "-2000px" }, 800, "easeInBack", function () {
                jQuery(this).removeClass("work-item-active").addClass("hide");
            });

            jQuery(workItemActive).next().animate({ "margin-left": "0px" }, 800, "easeInOutQuart", function () {
                jQuery(this).addClass("work-item-active");
                if (jQuery(this).prev().attr("rel") == "first")
                    jQuery("#work-paging-prev").fadeIn();
                if (jQuery(this).attr("rel") == "last")
                    jQuery("#work-paging-next").fadeOut();
            });
        }
        else
            jQuery("#work-paging-next").fadeOut();

    });

    jQuery("#work-paging-prev").css({ "display": "none" });

});
