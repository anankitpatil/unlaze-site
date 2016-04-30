$(document).ready(function() {
	
	// Parallax
	$(window).on('scroll', function () {
		$('.parallax').each(function(index, element) {
            $(element).css('backgroundPosition', 'center ' + ($(window).scrollTop() - $(element).offset().top + 90)/5 + 'px');
        });
	});
	$('.parallax').each(function(index, element) {
		$(element).css('backgroundPosition', 'center ' + ($(window).scrollTop() - $(element).offset().top + 90)/5 + 'px');
	});
	
	// Init WOW script
	new WOW().init();
});