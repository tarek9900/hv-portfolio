/*================================================
[  Table of contents  ]
================================================
	01. Sticky Menu
	02. Owl Carousel
	03. ScrollUp jquery
	04. wow js active
	05. jQuery MeanMenu
	06. Video PopUp
	07. Textilate Activation
	08. Video Player
	09. Mail Chimp
	10. ColorSwitcher

 
======================================
[ End table content ]
======================================*/


(function($) {
    "use strict";

    if (window.location.pathname.indexOf("/admin") === 0) {
        return;
    }
    
/*------------------------------------
    01. Sticky Menu
-------------------------------------- */
    $(window).scroll(function() {
        if ($(this).scrollTop() > 1){  
            $('#sticky-header').addClass("sticky");
        }
        else{
            $('#sticky-header').removeClass("sticky");
        }
    });
    
/*------------------------------------
    02. Owl Carousel
------------------------------------- */
/*------------------------------------
    Testimonial Carousel
------------------------------------- */
	$('.testimonial-carousel').owlCarousel({
		loop:true,
		margin:0,
		nav:true,
		animateOut: 'slideOutDown',
		animateIn: 'zoomInLeft',		
		autoplay:false,
        dots:false,
		smartSpeed:3000,
		navText: ["<i class='icon ion-md-arrow-back'></i>","<i class='icon ion-md-arrow-forward'></i>"],
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:1
			}
		}
	});	
    
/*------------------------------------
    Blog Carousel
-------------------------------------- */
    $('.blog-carousel').owlCarousel({
        loop:true,
        autoPlay: false, 
        smartSpeed: 2000,
        fluidSpeed: true,
        nav:false,
        dots:false,
        margin:30,
        navText: ["<i class='icon ion-md-arrow-round-back'></i>","<i class='icon ion-md-arrow-round-forward'></i>"],
        responsiveClass:true,
        responsive:{
            0:{
                items:1 // from 0px up to 479px screen size 
            },
            480:{
                items:1, // from 480 to 677 
            },
            768:{
                items:2, // from this breakpoint 678 to 959
            },
            960:{
                items:2, // from this breakpoint 960 to 1199
            },
            1200:{
                items:3,
                loop:false,
            }
        }        
    }); 
    
/*------------------------------------
    Sidebar Carousel Active
-------------------------------------- */
    $('.sidebar-carosel').owlCarousel({
        autoPlay: false, 
        smartSpeed: 1000,
        loop:true,
        margin:15,
        nav:true,
        dots:false,
        navText: ["<i class='icon ion-md-arrow-round-back'></i>","<i class='icon ion-md-arrow-round-forward'></i>"],
        responsiveClass:true,
        responsive:{
            0:{
                items:1 // from 0px up to 479px screen size 
            },
            480:{
                items:2, // from 480 to 677 
            },
            767:{
                items:3, // from this breakpoint 678 to 959
            },
            960:{
                items:3, // from this breakpoint 960 to 1199
            },
            1200:{
                items:3,
            }
        }        
    }); 
    
/*------------------------------------
    Sidebar Carousel Active
-------------------------------------- */
    $('.portfolio-carousel-active').owlCarousel({
        autoplay:false,
        loop:true,
        margin:30,
        nav:false,
        dots:false,
        slideBy:1,
        items:4,
        responsiveClass:true,
        responsive:{
            0:{
                items:1 // from 0px up to 479px screen size 
            },
            480:{
                items:2, // from 480 to 677 
            },
            767:{
                items:3, // from this breakpoint 678 to 959
            },
            960:{
                items:4, // from this breakpoint 960 to 1199
            },
            1200:{
                items:4,
            }
        }        
    }); 
/*------------------------------------
    Pro Details Carousel Active
-------------------------------------- */
    $('.pro-details-active').owlCarousel({
        autoplay:false,
        loop:true,
        margin:0,
        navText: ["<i class='icon ion-md-arrow-round-back'></i>","<i class='icon ion-md-arrow-round-forward'></i>"],
        nav:true,
        dots:false,
        slideBy:1,
        items:1,
        responsiveClass:true,
      
    }); 
/*------------------------------------
    Related Carousel Active
-------------------------------------- */
	$('.related-project-active').owlCarousel({
        autoplay:false,
        loop:true,
        margin:15,
		nav:false,
        dots:false,
        slideBy:1,
        items:4,
        responsiveClass:true,
        responsive:{
            0:{
                items:1 // from 0px up to 479px screen size 
            },
            480:{
                items:2, // from 480 to 677 
            },
            767:{
                items:3, // from this breakpoint 678 to 959
            },
            960:{
                items:4, // from this breakpoint 960 to 1199
            },
            1200:{
                items:4,
            }
        }        
    }); 
	

/*------------------------------------
    brand Carousel
------------------------------------- */
    $('.brand-carusel-active').owlCarousel({
        loop:true,
        margin:115,
        nav:false,
        animateOut: 'slideOutDown',
        animateIn: 'zoomInLeft',        
        autoplay:false,
        dots:false,
        smartSpeed:3000,
        navText: ["<i class='icon ion-md-arrow-back'></i>","<i class='icon ion-md-arrow-forward'></i>"],
        responsive:{
            0:{
                items:1
            },
            480:{
                items:2,
                margin:10,
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    }); 
    
/*-------------------------------------------
    03. ScrollUp jquery
--------------------------------------------- */
    $.scrollUp({
        scrollText: '<i class="fa fa-angle-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });   
    
/*-------------------------------------------
    04. wow js active
--------------------------------------------- */
    new WOW().init();
    
/*-------------------------------------------
    05. jQuery MeanMenu
--------------------------------------------- */
	jQuery('nav#dropdown').meanmenu();
	
/*--------------------------
    06. Video PopUp
---------------------------- */	
    $('.popup-youtube').magnificPopup({
        type: 'iframe'
    });
    
    $('.popup-gallery').magnificPopup({
        type: 'image'
    });



/*------------------------------------
	07. Textilate Activation
--------------------------------------*/
    $('.tlt').textillate({
        loop: true,
        minDisplayTime: 2500
    });
    
/*------------------------------------
	08. Video Player
--------------------------------------*/
    $(".player").YTPlayer({
        showControls: false
    });    
    
    $(".player-small").YTPlayer({
        showControls: true
    });
    
    $(".player-blog").YTPlayer({
        showControls: true
    });
    
/*------------------------------------
		09. Mail Chimp
--------------------------------------*/
    if ($.fn && typeof $.fn.ajaxChimp === 'function' && $('#mc-form').length) {
        $('#mc-form').ajaxChimp({
            language: 'en',
            callback: mailChimpResponse,
            // ADD YOUR MAILCHIMP URL BELOW HERE!
            url: 'http://themeshaven.us8.list-manage.com/subscribe/post?u=759ce8a8f4f1037e021ba2922&amp;id=a2452237f8'
        });
    }
    
    function mailChimpResponse(resp) {
        
        if (resp.result === 'success') {
            $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
            $('.mailchimp-error').fadeOut(400);
            
        } else if(resp.result === 'error') {
            $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
        }  
    }


        /*----------------------------
    17. Nice Select Activation
    ------------------------------ */
    $('select').niceSelect();

    
    /*====== sidebarSearch ======*/
    function sidebarSearch() {
        var searchTrigger = $('button.sidebar-trigger-search'),
            endTriggersearch = $('button.search-close'),
            container = $('.main-search-active');
        
        searchTrigger.on('click', function() {
            container.addClass('inside');
        });
        
        endTriggersearch.on('click', function() {
            container.removeClass('inside');
        });
        
    };
    sidebarSearch();

    /*====== sidebarCart ======*/
    function sidebarNav() {
        var navbarTrigger = $('button.header-navbar-active'),
            endTrigger = $('button.op-sidebar-close'),
            container = $('.sidebar-portfolio-active'),
            wrapper = $('.wrapper');
        
        wrapper.prepend('<div class="body-overlay"></div>');
        
        navbarTrigger.on('click', function() {
            container.addClass('inside');
            wrapper.addClass('overlay-active');
        });
        
        endTrigger.on('click', function() {
            container.removeClass('inside');
            wrapper.removeClass('overlay-active');
        });
        
        $('.body-overlay').on('click', function() {
            container.removeClass('inside');
            wrapper.removeClass('overlay-active');
        });
    };
    sidebarNav();
    
    /*====== sidebarCart ======*/
    function sidebarMainmenu() {
        var menuTrigger = $('.clickable-mainmenu-active'),
            endTrigger = $('button.clickable-mainmenu-close'),
            container = $('.clickable-mainmenu');
        
        menuTrigger.on('click', function(e) {
            e.preventDefault();
            container.addClass('inside');
        });
        
        endTrigger.on('click', function() {
            container.removeClass('inside');
        });
    };
    sidebarMainmenu();

    /*--- clickable menu active ----*/
    const slinky = $('#menu').slinky();


/*=============  Tilt Hover Effects  ==============*/

    var tiltSettings = [
    {},
    {
        movement: {
            imgWrapper : {
                rotation : {x: -5, y: 10, z: 0},
                reverseAnimation : {duration : 50, easing : 'easeOutQuad'}
            },
            caption : {
                translation : {x: 20, y: 20, z: 0},
                reverseAnimation : {duration : 200, easing : 'easeOutQuad'}
            },
            overlay : {
                translation : {x: 5, y: -5, z: 0},
                rotation : {x: 0, y: 0, z: 6},
                reverseAnimation : {duration : 1000, easing : 'easeOutQuad'}
            },
            shine : {
                translation : {x: 50, y: 50, z: 0},
                reverseAnimation : {duration : 50, easing : 'easeOutQuad'}
            }
        }
    }];

    function init() {
        var idx = 0;
        [].slice.call(document.querySelectorAll('.tilter')).forEach(function(el, pos) { 
            idx = pos%2 === 0 ? idx+1 : idx;
            new TiltFx(el, tiltSettings[idx-1]);
        });
    }

    // Preload all images.
    $('.tilter').imagesLoaded(function () {
        init();
    });
    /*--
    Header Search Toggle
    -----------------------------------*/
    var searchToggle = $('.menu-toggle');
    searchToggle.on('click', function() {

        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $('.show-menu').removeClass('open');
            $('.menu-toggle .icon').removeClass('ion-md-close');
            $('.menu-toggle .icon').addClass('ion-md-menu');

        } else {
            $(this).addClass('open');
            $('.show-menu').addClass('open');
            $('.menu-toggle .icon').removeClass('ion-md-menu');
            $('.menu-toggle .icon').addClass('ion-md-close');
        }
    });

/*=============  Gallery Mesonry Activation  ==============*/

    $('.iamge-loaded-active').imagesLoaded(function () {


        // filter items on button click
        $('.pro-cat-list').on('click', 'button[data-filter]', function () {

            var filterValue = $(this).attr('data-filter');
            $grid.isotope({
              filter: filterValue
            });
        });


        // change is-checked class on buttons
        $('.pro-cat-list button[data-filter]').on('click', function () {
            $('.pro-cat-list button[data-filter]').removeClass('is-checked');
            $(this).addClass('is-checked');
            var selector = $(this).attr('data-filter');

            $grid.isotope({
              filter: selector
            });
            return false;
        });


        // init Isotope
        var $grid = $('.masonry-wrap-active').isotope({
            itemSelector: '.single-item',
            percentPosition: true,
            transitionDuration: '0.7s',
            masonry: {
              // use outer width of grid-sizer for columnWidth
              columnWidth: '.single-item',
            }
        });
    });

    /*------ 11. Testimonial ------*/
    $('.home4-slider-active').slick({
        autoplay: false,
        infinite: true,
        speed: 500,
        vertical: true,
        verticalSwiping: true,
        cssEase: 'ease-in-out',
        draggable: false,
        arrows: false,
        dots: true,
        adaptiveHeight: true,
        waitForAnimate: true,
    });
    

/* Preserve selected portfolio filter when navigating from detail pages */
(function preservePortfolioFilter() {
    var params = new URLSearchParams(window.location.search);
    var filter = params.get('filter');
    if (!filter || !/^(drawing|sculptures)$/.test(filter)) {
        return;
    }

    var links = document.querySelectorAll(
        'a[href=\"portfolio.html\"],a[href=\"/portfolio.html\"],a[href=\"portfolio\"],a[href=\"/portfolio\"]'
    );

    links.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (href.indexOf('filter=') !== -1) {
            return;
        }

        var separator = href.indexOf('?') === -1 ? '?' : '&';
        link.setAttribute('href', href + separator + 'filter=' + filter);
    });
})();





})(jQuery);
























