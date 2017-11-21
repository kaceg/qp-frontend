
$(document).ready(function() {
	$("#headerInc").load("/inc/header-kiosk.html", function() {
        console.log('header was loaded');
        
        $("select").selectBoxIt();
	});
});