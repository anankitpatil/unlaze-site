$(document).ready(function() {
    
	// Nav dropdown
	$('.navbar .dropdown').hover(function() {
		$('.dropdown-menu', this).stop( true, true ).fadeIn('fast');
		$(this).toggleClass('open');
		$('b', this).toggleClass("caret caret-up");                
	}, function() {
		$('.dropdown-menu', this).stop( true, true ).fadeOut('fast');
		$(this).toggleClass('open');
		$('b', this).toggleClass('caret caret-up');    
    });
	
	// How it works
	$('.works').animate({'top': -$('.works').height() + 'px'}, 600, 'easeInOutQuad', function() { $(this).css('opacity', 1); });
	$(window).resize(function() { 
		$('.works').stop(true, true).animate({'top': -$('.works').height() + 'px'}, 600, 'easeInOutQuad');
		$('body').stop(true, true).animate({'margin-top': '0px'}, 600, 'easeInOutQuad');
	});
	$('.works-button, .works .close').on('click', function() {
		if ($('.works').css('top') == '0px') {
			$('.works').stop(true, true).animate({'top': -$('.works').height() + 'px'}, 600, 'easeInOutQuad');
			$('body').stop(true, true).animate({'margin-top': '0px'}, 600, 'easeInOutQuad');
		} else {
			$('.works').stop(true, true).animate({'top': '0px'}, 600, 'easeInOutQuad');
			$('body').stop(true, true).animate({'margin-top': $('.works').height() + 'px'}, 600, 'easeInOutQuad');
		}
	});
	
	// Init WOW script
	new WOW().init();
});