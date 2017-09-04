/*************************
	FUNCTIONS
*************************/

(function ($) {
// VERTICALLY ALIGN FUNCTION
$.fn.vAlign = function() {
	return this.each(function(i){
	var ah = $(this).height();
	var ph = $(this).parent().height();
	var mh = Math.ceil((ph-ah) / 2);
	$(this).css('padding-top', mh);
	});
};
})(jQuery);

function resizeContent() {
	jQuery(".map .sh").matchHeight();
	jQuery(".scroll-match-height").matchHeight();
	jQuery(".maintenance .matchheight").matchHeight();
	$(".login .matchheight").matchHeight();
	if(jQuery(".scroll-in-parent").length) jQuery(".scroll-in-parent").stick_in_parent();
	jQuery(".vertical-align").vAlign();
}

function pagescroll(pageElement) {
	var scroll_duration = 200;
	jQuery('html, body').animate({scrollTop: pageElement.offset().top}, scroll_duration);
}


/*************************
	GMAP
*************************/

var centerOnFirst = false; // TRUE = first spot is center - FALSE = center focus on all icons

function showHidePane(map,m) {
	// SHOW PANE
	var widthPane = jQuery(".infoPanes").width();
	var panBy = (widthPane/2)*-1;
	
	if(jQuery(".infoPanes").hasClass("shown")) {
		jQuery(".infoPanes").removeClass("shown").delay(250).queue(function(next){
			jQuery(".pane").css("display","none");
			jQuery(".pane." + m.identifier).css("display","block");
		    $(this).addClass("shown");
		    next();
		});
	} 
	else {
		jQuery(".pane").css("display","none")
		jQuery(".pane." + m.identifier).css("display","block");
		jQuery(".infoPanes").addClass("shown");
	}
		
	map.panTo(m.position);
	map.panBy(panBy, 0);
}


function initialize() {
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    
    //Markers
	var markers = [];
	var markersClusterer = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < destinations.length; i++) {
        var data = destinations[i];
        var icon = new google.maps.MarkerImage(data.ico);
        var myLatlng = new google.maps.LatLng(data.latitude, data.longitude);
        
        var icon = {
		    url: "/static/assets/gmap/gmap-marker.svg"
		 };
		 
		var icon_active = {
			url: "/static/assets/gmap/gmap-marker-active.svg"
		}

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: icon,
            draggable: false,
            title: data.title,
            identifier: data.identifier
        });
        
		markersClusterer.push(marker);
		markers[i] = marker;
		markers[i].currentIcon = icon;

		function t() {
			var m = marker;
			google.maps.event.addListener(marker, 'click', function() {
				
				// ONLY CURRENT ICON ACTIVE
				for (var i = 0; i < destinations.length; i++) {
					markers[i].setIcon(icon);
					markers[i].currentIcon = icon;
				}
				m.setIcon(icon_active);
				m.currentIcon = icon_active;
				
				showHidePane(map,m);
				
			});
			
			// ACTIVE?
			google.maps.event.addListener(marker, 'mouseover', function() {
				m.setIcon(icon_active);
			});
			google.maps.event.addListener(marker, 'mouseout', function() {
				m.setIcon(m.currentIcon);
			});
			
		}t();
		
        bounds.extend(myLatlng);
    }
    
    
    // CLUSTERING
	var clusterStyles = [
		{
			textColor: 'white',
			textSize: 12,
			url: '/static/assets/gmap/gmap-cluster.svg',
			width: 35,
			height: 35
		}
	];
	var mcOptions = {
		styles: clusterStyles,
		maxZoom: 9
	};
	var markerCluster = new MarkerClusterer(map, markersClusterer, mcOptions);
	
	
	// ZOOM CHANGE
	google.maps.event.addListener(map, 'zoom_changed', function() {

		var baseFactor = 1.25;
		var baseWidth = 2.60;
		var baseHeight = 3.75;
	    var maxWidth = 88;
	    var maxHeight = 128;							    
	    
	    
	    var zoom = map.getZoom();
	    var relFactor = 1+(zoom*baseFactor);
	    
	    var relativeWidth = baseWidth*relFactor;
	    var relativeHeight = baseHeight*relFactor;
	    
	    //alert("zoom: "+zoom+"\nwidth: "+relativeWidth+"\nheight: "+relativeHeight);
	    							
	    if(relativeWidth > maxWidth) relativeWidth = maxWidth;
	    if(relativeHeight > maxHeight) relativeHeight = maxHeight;
	    
	    for (var i = 0; i < destinations.length; i++) {
		    markers[i].setIcon(
		        new google.maps.MarkerImage(
		            markers[i].getIcon().url,
		            null,//size
		            null,//origin
		            null, //anchor
		            new google.maps.Size(relativeWidth, relativeHeight)
		        )
		    );	
		}					
		
	});
    
	if(markers.length > 1 && !centerOnFirst){
		map.fitBounds(bounds);
	} else {
		//map.fitBounds(bounds);
		//var spot = destinations[0];		
		//map.panTo(new google.maps.LatLng(spot.lat, spot.lng));	
		//map.setZoom(9);	
		map.setCenter(new google.maps.LatLng(20.0, 15.0));
	}
	
	// Center resize
	google.maps.event.addDomListener(window, 'resize', function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
		map.fitBounds(bounds);
	});
    
}

$(document).ready(function($) {
	
	console.log('load includes');
    $("#cookieInc").load("/inc/cookie.html", function() {
    	console.log('Cookie notification was loaded');
    });
    $("#navInc").load("/inc/nav.html", function() {
      	console.log('nav was loaded');
    });
    $("#navIncMyQP").load("/inc/nav-myqp.html", function() {
      	console.log('nav was loaded');
    });
    $("#bigsearchInc").load("/inc/bigsearch_inpage.html", function() {
      	console.log('bigsearch was loaded');
    });
    $("#footerInc").load("/inc/footer.html", function() {
      	console.log('footer was loaded');
    });
    $("#footerIncMyQP").load("/inc/footer-myqp.html", function() {
      	console.log('footer was loaded');
    });
    $('#toggle-refinementfilter').click( function() {
      console.log('toggle clicked');
      $('#refinementfilter').toggle( "slow", function() {
        // Animation complete.
      });
    });
	
	jQuery(".resultsFilter :checkbox").change(function() {
		if(jQuery(this).attr("id") == "all") {
			jQuery(".resultsFilter :checkbox").removeAttr('checked');
			jQuery(".resultsFilter #all")[0].checked = true;
        } else {
	        jQuery(".resultsFilter #all")[0].checked = false;
        }
	});

	jQuery(".togglehide").click(function() {
		var target = "." + $(this).attr('data-target')
		jQuery(target).toggleClass("hidden");
		return false;
	});

	jQuery(".smoothscroll").click(function() {
		var divId = jQuery(this).attr("href");
		pagescroll(jQuery(divId));
		return false;
	});

	jQuery(".pane .bar a.slide").click(function(panBy) {
		var panBy;
		jQuery(".infoPanes").removeClass("shown");
	});
	
	/*************************
		TOOLTIP
	*************************/

	$(".tooltip-trigger").on('mousemove', function(e) {
		var notice = $(this).data("notice");
		$('#tooltip').attr('title', notice)
          .tooltip('fixTitle')
          .tooltip('show')
          .css({top: e.pageY, left: e.pageX });
	});
	
	$(".tooltip-trigger").on('mouseleave', function(e) {
	    $('#tooltip').tooltip('hide');
	});
	
  	/*************************
		BACK TO TOP
	*************************/
	
	// browser window scroll (in pixels) after which the "back to top" link is shown
	var	offset = 300,
	//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
	offset_opacity = 300,
	//grab the "back to top" link
	$back_to_top = $('.cd-top');

	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});

	if($(".myqp-new select").length){
		$(".myqp-new select").selectBoxIt();
	}
	
	if($(".datepicker").length){
		$(".datepicker > input").datetimepicker({
			format: "DD/MM/YYYY",
			minDate: new Date(),
			useCurrent: false,
			icons: {
				time: 'fa fa-clock-o',
				date: 'fa fa-calendar',
				up: 'fa fa-chevron-up',
				down: 'fa fa-chevron-down',
				previous: 'fa fa-chevron-left',
				next: 'fa fa-chevron-right',
				today: 'fa fa-camera',
				clear: 'fa fa-trash',
				close: 'fa fa-times'
			},
			debug: false
		});
	}
});


/*************************
	LOAD/RESIZE/SCROLL/...
*************************/

$(document).ready(function() {

	$(window).load(function() {
		resizeContent($);
	});

	$(window).resize(function() {
		resizeContent($);
	});

});