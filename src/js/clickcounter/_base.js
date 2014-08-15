'use strict';

var close = function () {
    window.parent.postMessage("remove", "*");
}

/**
 * Send a message to the parent to request the closing of the clickcounter.
 */
var registerClickHandler = function () {
    document.body.parentElement.onclick = close;
};

var fetchConfig = function (completeFunc) {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, function (e) {
        var config = JSON.parse(e.data);
        completeFunc(config);
    }, false);

    window.parent.postMessage("get config", "*");
};

var animateBar = function (pinkbar, targetWidth, completeFunc) {
    pinkbar.find('.inner').fadeIn(500).delay(1250).fadeOut(500, completeFunc);
    pinkbar.find('.bar').animate({width: targetWidth}, 750, 'easeOutQuint');
}

function initPinkBar(clickcounter, pinkbar, config) {
    var pinkbarMargin = parseInt('{{pinkbar-margin}}', 10);
    var barWidth = clickcounter.width() - (2 * pinkbarMargin);
    pinkbar.css({
        width: barWidth
    });
    return barWidth;
}

var showClickCounter = function (config) {
    $('body').css('display', 'block');
    var clickCounter = $('#clickcounter');
    var pinkbar = clickCounter.find('.pinkbar');
    var barWidth = initPinkBar(clickCounter, pinkbar, config);
    // easeOutBack
    // easeOutElastic, 1000
    animateClickCounterEntry(clickCounter, 400, 'easeOutBack', function () {
        animateBar(pinkbar, barWidth * config.percent, function () {
            animateClickCounterExit(clickCounter, 300, 'linear', close);
        });
    });
};

$(function () {
    registerClickHandler();
    fetchConfig(showClickCounter);
});


