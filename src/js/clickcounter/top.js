'use strict';

/**
 * Controls the top clickcounter
 */
(function () {
    var clickcounterWidth = parseInt('{{topbottom-width}}', 10);
    var clickcounterHeight = parseInt('{{topbottom-height}}', 10);
    var shadowSize = parseInt('{{shadow-size}}', 10);

    function animate(clickcounter) {
        var windowWidth = $(window).width();
        $('body').css('display', 'block');
        clickcounter.css({
            left: (windowWidth - clickcounterWidth) / 2,
            top: (-clickcounterHeight - shadowSize) * 2
        });
        clickcounter.animate({top: 0 }, 1000, 'easeOutElastic');
    }

    $(function () {
        animate($('#clickcounter-top'));
    });
})();
