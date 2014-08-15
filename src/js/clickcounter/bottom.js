'use strict';

/**
 * Controls the Bottom clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animateClickCounterEntry(clickcounter, duration, ease, completeFunc) {
        clickcounter.css({
            left: ($(window).width() - clickcounter.width()) / 2,
            bottom: (-clickcounter.height() + shadowSize) * 2
        });
        clickcounter.animate({bottom: 0}, duration, ease, completeFunc);
    }

    function animateClickCounterExit(clickcounter, duration, ease, completeFunc) {
        clickcounter.animate({bottom: (-clickcounter.height() + shadowSize) * 2}, duration, ease, completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
