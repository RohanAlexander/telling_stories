define([
    'jquery',
    'mage/translate',
    'mage/smart-keyboard-handler',
    'mage/mage',
    'mage/ie-class-fixer',
    'domReady!',
    'slick',
    //'smoothState',
    //'tmripple',
    //'parallax',
    'bootstrap',
    'bootstrapSlider',
    'mediaelement',
    'jqueryIas',
    'infinitescroll'
], function ($, $t, keyboardHandler, Masonry, infinitescroll, jqueryIas, MediaElementPlayer) {
    //'use strict';

    var slickOptions = {
        lazyLoad: 'progressive',
        dots: true,
        infinite: false,
        speed: 1000,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        cssEase: 'ease-in-out',
        easing: 'ease-in-out',
        arrows: false,
        //infinite: true,
        pauseOnHover: false
    };

    var lustreRange = '';
    var complexionRange = '';
    var shapeRange = '';
    var sizeRange = '';
    var colourRange = '';
    var sizeDisplayRange = '';

    var options = {
        prefetch: true,
        cacheLength: 1,
        blacklist: '.no-smoothState, form, a.action.delete',
        anchors: 'a.smoothLink, .smoothLink > a',
        onStart: {
            duration: 250, // Duration of our animation
            render: function ($container) {
                // Add your CSS animation reversing class
                $container.addClass('is-exiting');
                SgyIAS.destroy();

                // Restart your animation
                //smoothState.restartCSSAnimations();
            }
        },
        onReady: {
            duration: 0,
            render: function ($container, $newContent) {
                // Remove your CSS animation reversing class
                $container.removeClass('is-exiting');

                // Inject the new content
                $container.html($newContent);

            }
        },
        onAfter: function() {
            init();
            // trigger reinit for magento 2
            $('#main').first().trigger('contentUpdated');

            // trigger minicart update
            if ($.fn.applyBindings != undefined) {
                $('#minicart').applyBindings();
                $('#wishlist-top').applyBindings();

                $('#btn-minicart-close').click(function(e){
                    $('#minicart').trigger('click');
                });
            }
        }
    };

    // init smoothState
    if($(window).width() > 800) {
        //$('#main').smoothState(options);
    } else {
        $('.submenu').css('height','auto').css('display','none');
    }

    init();

    $('body').addClass('page-products');

    function resizeRangeSlider(lustreRange, complexionRange, shapeRange, sizeRange, colourRange) {
        if($(window).width() < 767) {
            lustreRange.bootstrapSlider('setAttribute', 'orientation', 'horizontal');
            complexionRange.bootstrapSlider('setAttribute', 'orientation', 'horizontal');
            shapeRange.bootstrapSlider('setAttribute', 'orientation', 'horizontal');
            sizeRange.bootstrapSlider('setAttribute', 'orientation', 'horizontal');
            colourRange.bootstrapSlider('setAttribute', 'orientation', 'horizontal');
        } else {
            lustreRange.bootstrapSlider('setAttribute', 'orientation', 'vertical');
            complexionRange.bootstrapSlider('setAttribute', 'orientation', 'vertical');
            shapeRange.bootstrapSlider('setAttribute', 'orientation', 'vertical');
            sizeRange.bootstrapSlider('setAttribute', 'orientation', 'vertical');
            colourRange.bootstrapSlider('setAttribute', 'orientation', 'vertical');
        }
        lustreRange.bootstrapSlider('refresh');
        complexionRange.bootstrapSlider('refresh');
        shapeRange.bootstrapSlider('refresh');
        sizeRange.bootstrapSlider('refresh');
        colourRange.bootstrapSlider('refresh');
    }

    // HELPER FUNCTIONS HERE
    // hide splash after page load
    function splash(param) {
        var time = param;

        var video = $('video');

        var homeSplash = $('#homeSplash');
        homeSplash.css('background-image', 'url(/pub/media/wysiwyg/homeSlider-1.jpg)');

        video.on('loadeddata', function() {
            console.log('video loaded');
            $('.vidbg-container').addClass('show-now');
            setTimeout(function () {
                $('.homepage-splash').fadeOut(1500);
                //$('body').css('overflow', 'auto');

                if ($(window).width() < 769) {
                    $('.homepage-scroller').show();
                } else {
                    $('.homepage-slider.bak').show();
                }

                $('body').css('overflow', 'auto');
                $('.homepage-slider.bak').slick({
                    lazyLoad: 'progressive',
                    dots: true,
                    infinite: false,
                    speed: 1000,
                    slidesToShow: 1,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    fade: true,
                    cssEase: 'ease-in-out',
                    easing: 'ease-in-out',
                    arrows: false,
                    infinite: true,
                    pauseOnHover: false
                });
            }, time);

        });
    }

    function getFlexImage(imageType) {
        var flexArray = $('#maincontent').find('.flexImage');

        for (var i = flexArray.length - 1; i >= 0; i--) {
            var imageLink = $(flexArray[i]).attr(imageType);

            if ( $(flexArray[i]).is( "img" ) ) {
                $(flexArray[i]).attr("src", imageLink);
            } else {
                $(flexArray[i]).css('background-image', 'url('+imageLink+')');
            }
        }
    }

    function removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    // init function
    function init() {
        var values = [];
        $('body').css('overflow', 'auto');

        // add scaling to advancedSearch
        $('#advancedSearch').addClass('scaling');

        // start tabs
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            complexionRange.bootstrapSlider('refresh');
            lustreRange.bootstrapSlider('refresh');
            shapeRange.bootstrapSlider('refresh');
            sizeRange.bootstrapSlider('refresh');
            colourRange.bootstrapSlider('refresh');
            sizeDisplayRange.bootstrapSlider('refresh');
        });

        // reload vid
        var video = document.getElementById('player');

        if(typeof video != 'undefined' && video != null) {
            //video.load();
            $('#player').mediaelementplayer({
                stretching: 'responsive',
                alwaysShowControls: false,
                videoHeight: '514px'
            });
        }

        var overlayText = '<div class="overlayText"><H2>THE ARTISTRY OF PASPALEY JEWELLERY</H2> <H4><span class="btnPlay">PLAY THE VIDEO</span></H4></div>';
        $('.featureVideo .mejs__poster').append(overlayText);

        var distance = 298.305085;
        // start range slider
        // rangeslider for lustre
        if(typeof(document.getElementById('lustreRange')) != 'undefined' && document.getElementById('lustreRange') != null){
            lustreRange = $('#lustreRange').bootstrapSlider({
                min: 0,
                max: 59,
                value: 0,
                orientation: 'vertical',
                tooltip: 'hide',
                step: 1,
                ticks: [0, 15, 30, 45, 59],
                ticks_labels: new Array($t('EXCELLENT'), $t('VERY GOOD'), $t('GOOD'), $t('FAIR'), $t('POOR')),
                ticks_positions: [0, 25, 50, 75, 100],
                natural_arrow_keys: true,
                ticks_snap_bounds: 10
            });

            lustreRange.on('change', function() {
                //var percentage = lustreRange.bootstrapSlider('getValue') / lustreRange.bootstrapSlider('getAttribute', 'max') * 100;

                var totalSize = (distance * (lustreRange.bootstrapSlider('getAttribute', 'max'))) + 3; // 17898.31 -17603px

                var newPosition = totalSize - (distance*lustreRange.bootstrapSlider('getValue'));
                $('.lustreImage').css('background-position-x', '-'+newPosition+'px');
            });
        }

        // rangeslider for complexion
        if(typeof(document.getElementById('complexionRange')) != 'undefined' && document.getElementById('complexionRange') != null) {
            complexionRange = $('#complexionRange').bootstrapSlider({
                min: 0,
                max: 59,
                value: 0,
                orientation: 'vertical',
                tooltip: 'hide',
                step: 1,
                ticks: [0, 15, 30, 45, 59],
                ticks_labels: new Array($t('CLEAN'), $t('MINOR SPOTTED'), $t('LIGHTLY SPOTTED'), $t('MODERATEDLY SPOTTED'), $t('HEAVILY SPOTTED')),
                ticks_positions: [0, 25, 50, 75, 100],
                natural_arrow_keys: true,
                ticks_snap_bounds: 10
            });

            complexionRange.on('change', function() {
                //var percentage = lustreRange.bootstrapSlider('getValue') / lustreRange.bootstrapSlider('getAttribute', 'max') * 100;
                var totalSize = (distance * (complexionRange.bootstrapSlider('getAttribute', 'max'))) + 2.7;
                var newPosition = totalSize - (distance*complexionRange.bootstrapSlider('getValue'));
                $('.complexionImage').css('background-position-x', '-'+newPosition+'px');
            });
        }

        // rangeslider for shape
        if(typeof(document.getElementById('shapeRange')) != 'undefined' && document.getElementById('shapeRange') != null) {
            shapeRange = $('#shapeRange').bootstrapSlider({
                min: 0,
                max: 59,
                value: 0,
                orientation: 'vertical',
                tooltip: 'hide',
                step: 1,
                ticks: [0, 15, 30, 45, 59],
                ticks_labels: new Array($t('BAROQUE'), $t('BUTTON'), $t('ROUND'), $t('OVAL'), $t('DROP')),
                ticks_positions: [0, 25, 50, 75, 100],
                natural_arrow_keys: true,
                ticks_snap_bounds: 10
            });
            var totalSizeShape = (distance * (shapeRange.bootstrapSlider('getAttribute', 'max'))) + 12;
            $('.shapeImage').css('background-position-x', '-'+totalSizeShape+'px');

            shapeRange.on('change', function() {
                //var percentage = lustreRange.bootstrapSlider('getValue') / lustreRange.bootstrapSlider('getAttribute', 'max') * 100;
                var newPosition = totalSizeShape - (distance*shapeRange.bootstrapSlider('getValue'));
                $('.shapeImage').css('background-position-x', '-'+newPosition+'px');
            });
        }

        // rangeslider for size
        if(typeof(document.getElementById('sizeRange')) != 'undefined' && document.getElementById('sizeRange') != null) {
            sizeRange = $('#sizeRange').bootstrapSlider({
                min: 0,
                max: 45,
                value: 0,
                orientation: 'vertical',
                tooltip: 'hide',
                step: 1,
                ticks: [0, 22.5, 44],
                ticks_labels: new Array($t('LARGE'), $t('MEDIUM'), $t('SMALL')),
                ticks_positions: [0, 50, 100],
                natural_arrow_keys: true,
                ticks_snap_bounds: 10
            });

            var totalSize = distance * (sizeRange.bootstrapSlider('getAttribute', 'max'));
            $('.sizeImage').css('background-position-x', '-'+totalSize+'px');

            sizeRange.on('change', function() { //-13128px
                //var percentage = lustreRange.bootstrapSlider('getValue') / lustreRange.bootstrapSlider('getAttribute', 'max') * 100;

                var newPosition = totalSize - (distance*sizeRange.bootstrapSlider('getValue'));
                $('.sizeImage').css('background-position-x', '-'+newPosition+'px');
                sizeDisplayRange.bootstrapSlider('setValue', sizeRange.bootstrapSlider('getValue'));
            });
        }

        // rangeslider for size
        if(typeof(document.getElementById('sizeDisplayRange')) != 'undefined' && document.getElementById('sizeDisplayRange') != null) {
            sizeDisplayRange = $('#sizeDisplayRange').bootstrapSlider({
                min: 0,
                max: 45,
                value: 0,
                orientation: 'vertical',
                tooltip: 'hide',
                step: 1,
                ticks: [0, 3.14285714, 6.28571428, 9.42857142, 12.5714286, 15.7142857, 18.8571428, 22, 25.1428571, 28.2857143, 31.4285714, 34.5714285, 37.7142857, 40.8571428, 44],
                ticks_labels: ['20mm', '19mm', '18mm', '17mm', '16mm', '15mm', '14mm', '13mm', '12mm', '11mm', '10mm', '9mm', '8mm', '7mm', '6mm'],
                ticks_positions: [0, 7.14285714, 14.2857143, 21.4285714, 28.5714286, 35.7142857, 42.8571428, 50, 57.1428571, 64.2857143, 71.4285714, 78.5714285, 85.7142857, 92.8571428, 100],
                natural_arrow_keys: true,
                enabled: false,
                ticks_snap_bounds: 10
            });
        }

        // rangeslider for colour
        if(typeof(document.getElementById('colourRange')) != 'undefined' && document.getElementById('colourRange') != null) {
            colourRange = $('#colourRange').bootstrapSlider({
                min: 0,
                max: 59,
                value: 0,
                orientation: 'vertical',
                tooltip: 'hide',
                step: 1,
                ticks: [0, 10, 20, 30, 40, 50, 59],
                ticks_labels: new Array($t('SILVER PINK'), $t('SILVER'), $t('WHITE PINK'), $t('WHITE'), $t('CREAM'), $t('CHAMPAGNE'), $t('GOLD')),
                ticks_positions: [0, 16.6666667, 33.3333334, 50, 66.6666668, 83.3333335, 100],
                natural_arrow_keys: true,
                ticks_snap_bounds: 10
            });

            colourRange.on('change', function() {
                //var percentage = lustreRange.bootstrapSlider('getValue') / lustreRange.bootstrapSlider('getAttribute', 'max') * 100;
                var totalSize = (distance * (colourRange.bootstrapSlider('getAttribute', 'max')))+3; // 21 is correction number

                var newPosition = totalSize - (distance*colourRange.bootstrapSlider('getValue'));
                $('.colourImage').css('background-position-x', '-'+newPosition+'px');
            });
        }

        // check if window is smaller than 769
        $(window).on('resize', function() {
            if ($(window).width() < 769) {
                $('.homepage-scroller').show();
                $('.homepage-slider.bak').hide();
            } else {
                $('.homepage-slider.bak').show();
                $('.homepage-scroller').hide();
            }
            if(typeof(document.getElementById('lustreRange')) != 'undefined' && document.getElementById('lustreRange') != null && typeof(lustreRange) != 'undefined') {
                resizeRangeSlider(lustreRange, complexionRange, shapeRange, sizeRange, colourRange);
            }

        });
        if(typeof(document.getElementById('lustreRange')) != 'undefined' && document.getElementById('lustreRange') != null && typeof(lustreRange) != 'undefined') {
            resizeRangeSlider(lustreRange, complexionRange, shapeRange, sizeRange, colourRange);
        }

        $('a.nav-anchor').click(function(){
            $(this).addClass('active');
        });

        $('.back-to-top').click(function() {
            $('body, html').animate({ scrollTop: 0 }, 300);
        });

        $('.vidbg-box').vidbg({
            'mp4': '/pub/media/wysiwyg/PAS_Sunrise_Loop-1.mp4',
            'poster': '/pub/media/wysiwyg/homeSlider-1.jpg'
        }, {
            muted: true,
            loop: true,
            position: '50% 50%',
            resizing: true,
            overlay: false,
            overlayColor: '#000',
            overlayAlpha: '0.3',
        });

        //$('.parallax-window').parallax();

        // Check if this is a collections page
        // if it is, no change
        // if it is the world of paspaley page
        // change background to white
        var isHomepage = document.getElementById('homeSplash');
        var isCollections = document.getElementById('collections');
        var isProductCategory = document.getElementById('masonry-container');
        var isPhilanPage = document.getElementById('philanBg');
        var isCreationPage = document.getElementById('creationPage');
        var isNewsArchive = document.getElementById('footer-wrapper');
        var isProductPage = document.getElementById('productPage');
        var isLoginPage = document.getElementById('customer-login');
        var isCustomerPage = document.getElementById('customerPage');
        var isCartPage = document.getElementById('cartPage');
        var is404 = document.getElementById('404');
        var isAdvancedSearch = document.getElementById('advancedSearch');
        var isCheckoutPage = document.getElementById('checkout');
        var isSuccessPage = document.getElementById('success-page');
        var isBoutiquePage = document.getElementById('boutique-list');
        var isSinglePage = document.getElementById('single-page');
        var isSendFriend = document.getElementById('add-recipient-tmpl');
        //typeof(isCollections) == 'undefined' && typeof(isProductCategory)  == 'undefined' && typeof(isPhilanPage)  == 'undefined' && typeof(isCreationPage) == 'undefined' && typeof(isProductPage) == 'undefined' && typeof(isLoginPage)  == 'undefined' && typeof(isCustomerPage) == 'undefined' && typeof(isCartPage) == 'undefined' && typeof(is404) == 'undefined' ||

        if (isCollections == null && isProductCategory == null && isAdvancedSearch == null && isCheckoutPage == null && isPhilanPage == null && isCreationPage == null && isProductPage == null && isLoginPage == null && isCustomerPage == null && isCartPage == null && is404 == null && isBoutiquePage == null && isSinglePage == null && isSendFriend == null) {
            $('#main').addClass('whiteBg');
        } else {
            $('#main').removeClass('whiteBg');
        }

        if(isCollections != null && typeof(isCollections) != 'undefined') {
            $('#main').addClass('collectionPage');
        } else {
            $('#main').removeClass('collectionPage');
        }

        if(isNewsArchive != null && typeof(isNewsArchive) != 'undefined') {
            $('#main').addClass('newsArchive');
        } else {
            $('#main').removeClass('newsArchive');
        }

        if(isCreationPage != null && typeof(isCreationPage) != 'undefined') {
            $('#main').addClass('blackBg');
        } else {
            $('#main').removeClass('blackBg');
        }

        if(isHomepage != null && typeof(isHomepage) != 'undefined') {
            $('#main').addClass('homepage');
        } else {
            $('#main').removeClass('homepage');
        }

        if(isProductPage != null && typeof(isProductPage) != 'undefined') {
            $('#main').addClass('product-page');
        } else {
            $('#main').removeClass('product-page');
        }

        /*if($('#main').hasClass('whiteBg')) {
            $('body').css('background-color', '#fff');
        } else {
            $('body').css('background-color', '#EEEEEF');
        }*/

        if(isAdvancedSearch != null && typeof(isAdvancedSearch) != 'undefined' && window.location.href.indexOf('collections') < 0) {
            $('.jewellery').addClass('current');
        } else {
            $('.jewellery').removeClass('current');
        }

        if(isCheckoutPage != null && typeof(isCheckoutPage) != 'undefined' || isSuccessPage != null && typeof(isSuccessPage) != 'undefined') {
            $('.column.main').addClass('checkout');
        } else {
            $('.column.main').removeClass('checkout');
        }
        // ripple
        /*tmripple.init({
            color: 'rgba(255,207,34, 0.5)', // default is 'rgba(255, 255, 255, 0.4)' //#ffcf22
        });*/

        if ($('body').hasClass('checkout-cart-index')) {
            if ($('#co-shipping-method-form .fieldset.rates').length > 0 &&
                $('#co-shipping-method-form .fieldset.rates :checked').length === 0
            ) {
                $('#block-shipping').on('collapsiblecreate', function () {
                    $('#block-shipping').collapsible('forceActivate');
                });
            }
        }

        $('#dob').attr('placeholder', '1/1/1900');
        $('#special_date_info').attr('placeholder', '1/1/1900');

        $('.cart-summary').mage('sticky', {
            container: '#maincontent'
        });

        $('.panel.header > .header.links').clone().appendTo('#store\\.links');

        keyboardHandler.apply();

        //console.log($('.blog-link').attr('meta-link'));
        var blogArray = $('.ui-corner-all').find('.blog-link a');

        for (var i = blogArray.length - 1; i >= 0; i--) {
            //console.log(blogArray[i].getAttribute('meta-link'));
            if (window.location.href.indexOf(blogArray[i].getAttribute('meta-link')) >= 0) {
                blogArray[i].classList.add('current');
                blogArray[i].parentElement.classList.add('current');
                //console.log('hit');
                //console.log(blogArray[i].classList);
            } else if(window.location.href.indexOf('sales/order/view') >= 0) {
                blogArray[i].classList.add('current');
                blogArray[i].parentElement.classList.add('current');
            }
        }

        $('.btnShare').on('click', function(e) {
            e.preventDefault();
            $('.btnShare').toggleClass('current');
            $('.btnRemove').toggleClass('inActive');
            $('.product-item-shareActions').toggleClass('active');
            $('.product-item-selection').toggleClass('active');
        });

        $('.product-item-selection').on('click', function(e) {
            e.preventDefault();
            $(this).children('.circle').toggleClass('selected');

            if($(this).children('.circle').hasClass('selected')) {
                values.push($(this).children('.circle').attr('data-attr'));
            } else {
                removeA(values, $(this).children('.circle').attr('data-attr'));
            }
            $(".shareLink").attr('href', '/wishlist/index/share?product_id=' + values.join(","));
        });

        $('.btnFilter').on('click', function(e) {
            e.preventDefault();
            $('.btnFilter').toggleClass('current');
            $('#advancedSearch').toggleClass('active');
        });

        $('#advancedClose').on('click', function(e) {
            e.preventDefault();
            $('.btnFilter').removeClass('current');
            $('#advancedSearch').removeClass('active');
        });

        $('.btnShare').css('visibility', 'hidden');
        $('.btnShare').css('position', 'absolute');

        $('.btnFilter').css('visibility', 'hidden');
        $('.btnFilter').css('position', 'absolute');
        $('.btnFilter.mobile').css('position', 'relative');

        if (window.location.href.indexOf('jewellery') >= 0 || window.location.href.indexOf('catalogsearch/advanced') >= 0) {
            $('.btnFilter').css('visibility', 'initial');
        }

        if (window.location.href.indexOf('wishlist') >= 0) {
            $('.btnShare').css('visibility', 'initial');
        }
        if (window.location.href.indexOf('share') >= 0) {
            $('.btnShare').css('visibility', 'hidden');
        }

        var aCurrent = $("a.current").parents(".parent");
        aCurrent.addClass('current');

        var aParentCurrent = $('.parent.current').children('.submenu');
        aParentCurrent.addClass('display');

        var aParentCurrentChild = $('.parent.has-current').children('.submenu');
        aParentCurrentChild.addClass('display');

        if($('.submenu').hasClass('display')) {
            $('#maincontent').addClass('marginTop');
            $('.block-search').addClass('marginTop');
        } else {
            $('#maincontent').removeClass('marginTop');
            $('.block-search').removeClass('marginTop');
        }

        // toggle mobile menu
        $('.nav-toggle').click(function() {
            $('html').toggleClass('nav-before-open nav-open');
        });

        // hover to show dropdown menu
        $('.parent').mouseenter(function(){
            $(this).children('.submenu').css('display', 'block');
        });
        $(".parent").mouseleave(function(){
            $(this).children('.submenu').css('display', 'none');
        });

        $('li.top-item a.level-top').mouseenter(function(){
            $('.btnShare').removeClass('current');
            $('.btnRemove').removeClass('inActive');
            $('.product-item-shareActions').removeClass('active');
            $('.product-item-selection').removeClass('active');
        });

        if(isLoginPage != null && typeof(isLoginPage) != 'undefined') {
            var myPaspaley = $('.my-paspaley');
            myPaspaley.removeClass('current');
            myPaspaley.children('.submenu').removeClass('display');
            $('.btnLogout').css('display','block');
        } else {
            $('.btnLogout').css('display','none');
        }

        if(isCustomerPage != null && typeof(isCustomerPage) != 'undefined') {
            var blockSearch = $('#block-search');
            blockSearch.addClass('no-margin-right');
            $('.btnLogout').css('display','block');
        } else {
            $('.btnLogout').css('display','none');
        }

        $('.homepage-slider.bak').hide();
        $('.homepage-scroller').hide();

        if(isHomepage != null && typeof(isHomepage) != 'undefined') {
            splash(2000);
        }

        // collection slider
        $('.collection-slider').slick({
            lazyLoad: 'progressive',
            dots: true,
            infinite: false,
            speed: 1000,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            fade: true,
            cssEase: 'ease-in-out',
            easing: 'ease-in-out',
            arrows: false,
            infinite: true,
            pauseOnHover: false
        });
        $('.postGallery').slick({
            lazyLoad: 'progressive',
            dots: true,
            infinite: false,
            speed: 1000,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            fade: true,
            cssEase: 'ease-in-out',
            easing: 'ease-in-out',
            arrows: false,
            infinite: true,
            pauseOnHover: false
        });

        $('.back-to-top').css('display', 'none');
        // sticky menu
        $(window).on('scroll', function () {
            if( $(window).scrollTop() > $('.page-header').offset().top && !($('.page-header').hasClass('sticky'))){
                $('.page-header').addClass('sticky');
                $('#maincontent').addClass('has-menu-sticky');
                $('.back-to-top').css('display', 'block');
            } else if ($(window).scrollTop() == 0){
                $('.page-header').removeClass('sticky');
                $('#maincontent').removeClass('has-menu-sticky');
                $('.back-to-top').css('display', 'none');
            }
        });

        var productInfoHeight = 0;

        // resize to fix the height of product description and product gallery
        if ($(window).width() < 768) {
            $('#productPage').children('.product.description').css('height', 'auto');
            $('.main__item').off('mouseenter mouseleave');
            $('.submenu').css('display','none');
        } else {
            $('#productPage').children('.product.description').css('height', '');

            productInfoHeight = $('.gallery-item').height() - $('#productPage').children('.page-title-wrapper').height() - $('#productPage').children('.product-info-price').height() - $('#productPage').children('.product-add-form').height() - $('#productPage').children('.product-social-links').height() - 56;

            $('#productPage').children('.product.description').css('height', productInfoHeight);
        }

        // resize to change table image / mobile image / desktop images
        if ($(window).width() > 1024) {
            // find all image attribute of flexImage
            getFlexImage('desktop-image');
        } else if ($(window).width() <= 1024 && $(window).width() > 768) {
            getFlexImage('tablet-image');
        } else {
            getFlexImage('mobile-image');
        }

        if ($(window).width() < 640) {
            //$('#swatch-opt').addClass('mobile');

            if($('.configurable-attributes').hasClass('active')) {
                $('.page-bottom').addClass('hidden');
            } else {
                $('.page-bottom').removeClass('hidden');
            }
        } else {
            //$('#swatch-opt').removeClass('mobile');
            $('.page-bottom').removeClass('hidden');
        }

        $('.main__mobile-icon').click(function(){
            $(this).toggleClass('active');
            $(this).parents('.parent').children('.submenu').toggleClass('active');
        });

        $(window).on('resize', function() {
            if ($(window).width() < 768) {
                $('#productPage').children('.product.description').css('height', 'auto');
                $('.main__item').unbind('mouseenter mouseleave');
                $('.main__item').off('mouseenter mouseleave');
            } else {
                $('.parent').mouseenter(function(){
                    $(this).children('.submenu').css('display', 'block');
                });
                $(".parent").mouseleave(function(){
                    $(this).children('.submenu').css('display', 'none');
                });

                $('html').removeClass('nav-before-open').removeClass('nav-open');

                $('#productPage').children('.product.description').css('height', '');
                productInfoHeight = $('#gallery-placeholder').height() - $('#productPage').children('.page-title-wrapper').height() - $('#productPage').children('.product-info-price').height() - $('#productPage').children('.product-add-form').height() - $('#productPage').children('.product-social-links').height() - 55;
                $('#productPage').children('.product.description').css('height', productInfoHeight);
            }

            // resize to change table image / mobile image / desktop images
            if ($(window).width() > 1024) {
                // find all image attribute of flexImage
                getFlexImage('desktop-image');
            } else if ($(window).width() <= 1024 && $(window).width() > 768) {
                getFlexImage('tablet-image');
            } else {
                getFlexImage('mobile-image');
            }

            if ($(window).width() < 640) {
                //$('#swatch-opt').addClass('mobile');

                if($('.configurable-attributes').hasClass('active')) {
                    $('.page-bottom').addClass('hidden');
                } else {
                    $('.page-bottom').remove('hidden');
                }
            } else {
                //$('#swatch-opt').removeClass('mobile');
                $('.page-bottom').removeClass('hidden');
            }
        });

        $('.faq-heading h2').on('click', function(){
            $('.data-content').removeClass('active');
            $('.faq-heading h2').removeClass('active');
            var headingAttr = $(this).attr('data-attr');
            var contentAttr = $('.faq-contents').find('[content-attr='+headingAttr+']');

            contentAttr.addClass('active');
            $(this).addClass('active');
        });

        $('.content-heading').on('click', function(){
            $(this).parents('.content-wrapper').toggleClass('active');
            $(this).parents('.content-wrapper').siblings().removeClass('active');
        });

        // personal shopper here
        $('input.EMAIL').on('change', function(e){
            if(this.checked) {
                $('.response-field-email').css('display', 'block');
            } else {
                $('.response-field-email').css('display', 'none');
            }
        });

        $('input.PHONE').on('change', function(e){
            if(this.checked) {
                $('.response-field-number').css('display', 'block');
            } else {
                $('.response-field-number').css('display', 'none');
            }
        });

        $(window).load(function() {
            if(getUrlParameter('p') == undefined || getUrlParameter('p') == 1) {
                //console.log('normal');
            } else {
                //console.log('going to the prev');
                $('.ias-trigger-prev').click();
            }
        });
        /*
        if(isProductCategory != null && typeof(isProductCategory) != 'undefined') {
            // get history and display
            if (localStorage.getItem("history") != null) {
               var historyTmp = localStorage.getItem("history");
               console.log(historyTmp);

               var data_attr = 'li.masonry-item[data-attr="' + localStorage.getItem("history") + '"]';
               console.log($(data_attr).offset().top);
               $('html, body').animate({
                    scrollTop: $(data_attr).offset(500).top
                }, 'slow');
            }
        }*/
        if(isProductPage != null && typeof(isProductPage) != 'undefined') {
            // set history at product page
            localStorage.setItem("history", $('h1.page-title > span').text());
        }
    }

    // trying to get prev infinite scroll to work
    function iasPrev() {
        if ($('.pagination .prev').length) {
            $('.ias-trigger-prev').click();
        }
    }

    function scrollPagerScroll(scrollOffset, scrollThreshold) {
        if (($.ias().$scrollContainer.height() - scrollOffset) == 0) {
            $.ias().reinitialize();
            iasPrev();
        }
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
});