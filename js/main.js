$(document).ready(function() {
	
	//Set Image height
	/*$('.first').height($(window).height());
	$(window).resize(function(){
		$('.first').height($(window).height());
	});*/
	
	// Init nav
	$('nav').after($('nav').clone().addClass('clone'));
	$('nav.clone .navbar-toggle').attr('data-target', '#bs-example-navbar-collapse-2');
	$('nav.clone .navbar-collapse').attr('id', 'bs-example-navbar-collapse-2');
	
	// Nav smooth scroll
	$('nav li a').click(function(e) {
		e.preventDefault();
		var href = this.getAttribute('href');
		$('html,body').animate({scrollTop: $(this.getAttribute('href')).offset().top}, 600, 'easeInOutCubic', function() {
			window.location.hash = href;
		});
		$(this).parents('nav').find('.navbar-toggle').click();
	});
	
	// Parallax and scroll
	$(window).scroll(function(){
		//fix nav
		if($(window).scrollTop() >= $('.first').outerHeight() + 60) $('nav.clone').addClass('active');
		else $('nav.clone').removeClass('active');
		//top background slide
		$('.first').css('backgroundPosition', 'center ' + $(window).scrollTop()/5 + 'px');
		//Bottom background slide
		var fromBottom = $('body').height() - $(window).scrollTop();
		$('.bottom').css('backgroundPosition', 'center -' + fromBottom/5 + 'px');
		//Scroll top button
		if($(window).scrollTop() > 600){
			if(!$('.scrollup').length){
				$('<i class="fa fa-chevron-up scrollup"></i>').hide().appendTo('body').fadeIn().click(function(){
					$('html,body').animate({scrollTop:0}, 600);
				});
			}
		} else {
			if($('.scrollup').length){
				$('.scrollup').fadeOut(function(){ $(this).remove() });
			}
		}
		//Pause carousel
		if($(window).scrollTop() >= ($('.third').offset().top + $('.third').outerHeight())) $('.carousel').carousel('pause');
		else $('.carousel').carousel('cycle');
	});
	
	// Init WOW script
	new WOW().init();
	
	// Facebook signup
	function facebookReady() {
		FB.init({
			appId      : '486257738187973',
			xfbml      : true,
			status     : true,
			cookie     : true,
			version    : 'v2.1'
		});
		$(document).trigger('facebook:ready');
	}
	if(window.FB) facebookReady();
	else window.fbAsyncInit = facebookReady;
	
	$('.fb-signup').click(function(e) {
		e.preventDefault();
		$('.fb-signup').html("It's happening...").attr('href', '').unbind('click');
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				FB.api('/me', {fields: 'first_name, last_name, gender, bio, birthday, email, cover'}, function(response) {
					$.ajax({
						data: 'first_name=' + response.first_name + 
							'&last_name=' + response.last_name + 
							'&gender=' + response.gender + 
							'&about=' + response.bio +
							'&birthday=' + response.birthday +
							'&email=' + response.email +
							'&cover=' + response.cover.source +
							'&id=' + response.id,
						url: 'database.php',
						type: 'POST',
						beforeSend: function() {
							$('.fb-signup').html('Working...');
						},
						success: function(data) {
							$('.fb-signup').html(data).addClass('complete');
						}
					});
				});
			} else {
				FB.login(function(response){
					FB.api('/me', {fields: 'first_name, last_name, gender, bio, birthday, email, cover'}, function(response) {
						$.ajax({
							data: 'first_name=' + response.first_name + 
								'&last_name=' + response.last_name + 
								'&gender=' + response.gender + 
								'&about=' + response.bio +
								'&birthday=' + response.birthday +
								'&email=' + response.email +
								'&cover=' + response.cover.source +
								'&id=' + response.id,
							url: 'database.php',
							type: 'POST',
							beforeSend: function() {
								$('.fb-signup').html('Working...');
							},
							success: function(data) {
								$('.fb-signup').html(data).addClass('complete');
							}
						});
					});
				}, {scope: 'public_profile, email, user_about_me, user_activities, user_birthday, user_friends'});
			}
		});
	});

});