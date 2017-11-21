/*
	Dropdown with Multiple checkbox select with jQuery - May 27, 2013
	(c) 2013 @ElmahdiMahmoud
	license: https://www.opensource.org/licenses/mit-license.php
	codepen: https://codepen.io/elmahdim/pen/hlmri
	
	MODIFICATIONS MADE:
	- added document ready
	- changed class .multiselect-dropdown to .multiselect-dropdown
	- changed class .multiSelect to .multiSelect
*/

$(document).ready(function($) {
	
	$(".multiselect-dropdown dt a").on('click', function() {
		$(".multiselect-dropdown dd ul").slideToggle('fast');
		return false;
	});
	
	$(".multiselect-dropdown dd ul li").on('click', function() {
		//$(".multiselect-dropdown dd ul").hide();
		$(this).find('input[type="checkbox"]').click();
	});
	
	function getSelectedValue(id) {
		return $("#" + id).find("dt a span.value").html();
	}
	
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown") && !$clicked.is(".multiSelect li")) {
			$(".multiselect-dropdown dd ul").hide();
		}
	});
	
	$('.multiSelect input[type="checkbox"]').on('click', function(e) {
		e.stopPropagation();
		var title = $(this).closest('.multiSelect').find('input[type="checkbox"]').val(),
		title = $(this).val();
		if ($(this).is(':checked')) {
			var html = '<div title="' + title + '">' + title + '</div>';
			$('.multiSel').append(html);
			$(".hida").hide();
		} else {
			$('div[title="' + title + '"]').remove();
			var ret = $(".hida");
			$('.multiselect-dropdown dt a').append(ret);
		}
	});

});