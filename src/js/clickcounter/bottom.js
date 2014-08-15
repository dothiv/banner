'use strict';

/**
 * Controls the Bottom clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            left: ($(window).width() - clickcounter.width()) / 2,
            bottom: (-clickcounter.height() + shadowSize) * 2
        });
        clickcounter.animate({bottom: 0}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({bottom: (-clickcounter.height() + shadowSize) * 2}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
