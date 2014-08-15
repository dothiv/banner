'use strict';

/**
 * Controls the premium clickcounter
 */
(function () {
    var clickcounterWidth = parseInt('{{topbottom-width}}', 10);
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var animationOverflow = parseInt('{{animation-overflow}}', 10);
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            left: (windowWidth - clickcounterWidth) / 2,
            bottom: windowHeight + shadowSize
        });
        clickcounter.animate({bottom: shadowSize + animationOverflow}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({bottom: windowHeight + shadowSize}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
