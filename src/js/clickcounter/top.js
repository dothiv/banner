'use strict';

/**
 * Controls the top clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animateClickCounterEntry(clickcounter, duration, ease, completeFunc) {
        clickcounter.css({
            left: ($(window).width() - clickcounter.width()) / 2,
            top: (-clickcounter.height() - shadowSize) * 2
        });
        clickcounter.animate({top: 0 }, duration, ease, completeFunc);
    }

    function animateClickCounterExit(clickcounter, duration, ease, completeFunc) {
        clickcounter.animate({top: (-clickcounter.height() - shadowSize) * 2}, duration, ease, completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
