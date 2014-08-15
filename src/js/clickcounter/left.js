'use strict';

/**
 * Controls the left clickcounter
 */
(function () {
    var clickcounterWidth = parseInt('{{leftright-width}}', 10);
    var clickcounterHeight = parseInt('{{leftright-height}}', 10);
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var windowHeight = $(window).height();

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            top: (windowHeight - clickcounterHeight) / 2,
            left: (-clickcounterWidth - shadowSize) * 2
        });
        clickcounter.animate({left: 0}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({left: (-clickcounterWidth - shadowSize) * 2}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
