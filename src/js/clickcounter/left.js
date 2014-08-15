'use strict';

/**
 * Controls the left clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var windowHeight = $(window).height();

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            top: (windowHeight - clickcounter.height()) / 2,
            left: (-clickcounter.width() - shadowSize) * 2
        });
        clickcounter.animate({left: 0}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({left: (-clickcounter.width() - shadowSize) * 2}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
