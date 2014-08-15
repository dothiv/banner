'use strict';

/**
 * Controls the premium clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var animationOverflow = parseInt('{{animation-overflow}}', 10);
    var windowHeight = $(window).height();

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            left: ($(window).width() - clickcounter.width()) / 2,
            bottom: windowHeight + shadowSize
        });
        clickcounter.animate({bottom: Math.min(windowHeight - clickcounter.height() - shadowSize, shadowSize + animationOverflow)}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({bottom: windowHeight + shadowSize}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
