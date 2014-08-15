'use strict';

/**
 * Controls the right clickcounter
 */
(function () {
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animateClickCounterEntry(clickcounter, completeFunc) {
        clickcounter.css({
            top: ($(window).height() - clickcounter.height()) / 2,
            right: (-clickcounter.width() - shadowSize) * 2
        });
        clickcounter.animate({right: 0}, 1000, 'easeOutElastic', completeFunc);
    }

    function animateClickCounterExit(clickcounter, completeFunc) {
        clickcounter.animate({right: (-clickcounter.width() - shadowSize) * 2}, 500, 'linear', completeFunc);
    }

    // These are grunt includes
    {{include('clickcounter/_base.js')}}
})();
