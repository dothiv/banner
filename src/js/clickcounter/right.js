'use strict';

/**
 * Controls the right clickcounter
 */
(function () {
    var clickcounterWidth = parseInt('{{leftright-width}}', 10);
    var clickcounterHeight = parseInt('{{leftright-height}}', 10);
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var windowHeight = $(window).height();

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            top: (windowHeight - clickcounterHeight) / 2,
            right: (-clickcounterWidth - shadowSize) * 2
        });
        clickcounter.animate({right: 0}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({right: (-clickcounterWidth - shadowSize) * 2}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
