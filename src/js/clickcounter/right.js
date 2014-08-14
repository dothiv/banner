'use strict';

/**
 * Controls the right clickcounter
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
            right: (-clickcounterWidth - shadowSize) * 2
        });
        clickcounter.animate({right: 0}, 1000, 'easeOutElastic');
    }

    $(function () {
        animate($('#clickcounter-right'));
    });
})();
