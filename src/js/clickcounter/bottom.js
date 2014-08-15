'use strict';

/**
 * Controls the Bottom clickcounter
 */
(function () {
    var clickcounterWidth = parseInt('{{topbottom-width}}', 10);
    var clickcounterHeight = parseInt('{{topbottom-height}}', 10);
    var shadowSize = parseInt('{{shadow-size}}', 10);
    var windowWidth = $(window).width();

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            left: (windowWidth - clickcounterWidth) / 2,
            bottom: (-clickcounterHeight + shadowSize) * 2
        });
        clickcounter.animate({bottom: 0}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({bottom: (-clickcounterHeight + shadowSize) * 2}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
