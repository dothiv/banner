'use strict';

/**
 * Controls the premium clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var animationOverflow = parseInt('{{animation-overflow}}', 10);
    var windowHeight = $(window).height();

    function animateClickCounterEntry(clickcounter, duration, ease, completeFunc) {
        clickcounter.css({
            left: ($(window).width() - clickcounter.width()) / 2,
            bottom: windowHeight + shadowSize
        });
        clickcounter.animate({bottom: Math.min(windowHeight - clickcounter.height() - shadowSize, shadowSize + animationOverflow)}, duration, ease, completeFunc);
    }

    function animateClickCounterExit(clickcounter, duration, ease, completeFunc) {
        clickcounter.animate({bottom: windowHeight + shadowSize}, duration, ease, completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
