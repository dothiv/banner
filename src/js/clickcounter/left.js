'use strict';

/**
 * Controls the left clickcounter
 */
(function () {
    var clickcounterWidth = parseInt('{{leftright-width}}', 10);
    var clickcounterHeight = parseInt('{{leftright-height}}', 10);
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animate(clickcounter) {
        var windowHeight = $(window).height();
        $('body').css('display', 'block');
        clickcounter.css({
            top: (windowHeight - clickcounterHeight) / 2,
            left: (-clickcounterWidth - shadowSize) * 2
        });
        clickcounter.animate({left: 0}, 1000, 'easeOutElastic');
    }

    $(function () {
        animate($('#clickcounter-left'));
    });
})();
