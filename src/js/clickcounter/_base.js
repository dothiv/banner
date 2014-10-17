'use strict';

var close = function () {
    window.parent.postMessage("remove", "*");
};

/**
 * Send a message to the parent to request the closing of the clickcounter.
 */
var registerClickHandler = function () {
    document.body.parentElement.onclick = close;
};

// Config handing

var fetchConfig = function (completeFunc) {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent, function (e) {
        var config = JSON.parse(e.data);
        completeFunc(new ClickCounterConfig(config));
    }, false);

    window.parent.postMessage("get config", "*");
};

var ClickCounterConfig = function ClickCounterConfig(config) {
    this.bgColor = '#fff';
    this.barColor = '#E00073';
    this.fontColor = '#000';
    this.pinkBarMargin = parseInt('15', 10);
    this.premium = false;
    this.visual = null;
    this['visual@micro'] = null;
    this.bg = null;
    this.headlineFont = null;
    this.headlineFontWeight = null;
    this.headlineFontSize = null;
    this.textFont = null;
    this.textFontWeight = null;
    this.textFontSize = null;
    for (var k in config) {
        if (!config.hasOwnProperty(k)) {
            continue;
        }
        this[k] = config[k];
    }
};
ClickCounterConfig.prototype.parseColor = function (color) {
    return [color.substr(1, 2), color.substr(3, 2), color.substr(5, 2)];
};
ClickCounterConfig.prototype.getBarBgColor = function () {
    var bgCols = this.parseColor(this.getBgColor());
    var barCols = this.parseColor(this.getBarColor());
    var barBgCols = [];
    for (var i = 0; i < bgCols.length; i++) {
        barBgCols[i] = Math.round(parseInt(bgCols[i], 16) * 0.8 + parseInt(barCols[i], 16) * 0.2);
    }
    var barBgColor = ((1 << 24) + (barBgCols[0] << 16) + (barBgCols[1] << 8) + barBgCols[2]).toString(16).substr(1);
    return '#' + barBgColor;
};
ClickCounterConfig.prototype.getBarColor = function () {
    return this.barColor;
};
ClickCounterConfig.prototype.getFontColor = function () {
    return this.fontColor;
};
ClickCounterConfig.prototype.getBgColor = function () {
    return this.bgColor;
};
ClickCounterConfig.prototype.getPercent = function () {
    return this.percent;
};
ClickCounterConfig.prototype.getPinkBarMargin = function () {
    return this.pinkBarMargin;
};
ClickCounterConfig.prototype.isPremium = function () {
    return this.premium;
};
ClickCounterConfig.prototype.getVisual = function () {
    return [this.visual, this['visual@micro']];
};
ClickCounterConfig.prototype.getBg = function () {
    return this.bg;
};
ClickCounterConfig.prototype.getHeadlineFont = function () {
    return [this.headlineFont, this.headlineFontWeight, this.headlineFontSize];
};
ClickCounterConfig.prototype.getTextFont = function () {
    return [this.textFont, this.textFontWeight, this.textFontSize];
};

// /Config handing

var animateBar = function (pinkbar, barWidth, config, completeFunc) {
    var bar = pinkbar.find('.bar');
    if (bar.length == 0) { // No bar to animate (possible in micro): wait 1,5secs
        setTimeout(completeFunc, 1500);
        return;
    }
    var targetWidth = barWidth * config.getPercent();
    pinkbar.find('.inner').fadeIn(500).delay(1250).fadeOut(500, completeFunc);
    bar.animate({width: targetWidth}, 750, 'easeOutQuint');
    var money = pinkbar.find('.money:first');
    if (money.width() + config.getPinkBarMargin() > targetWidth) {
        money.addClass('right');
        money.css({'color': config.getBarColor()});
    }
};

function initPinkBar(clickcounter, pinkbar, config) {
    if (config.isPremium()) {
        pinkbar.css({'background-color': config.getBarBgColor(), 'color': config.getBgColor()});
        pinkbar.find('.bar:first').css({'background-color': config.getBarColor()});
    }
    var barWidth = clickcounter.width() - (2 * config.getPinkBarMargin());
    pinkbar.css({
        width: barWidth
    });
    return barWidth;
}

/**
 * Updates the html to contain the values from the config.
 *
 * @param clickcounter
 * @param config
 */
function initClickcounterData(clickcounter, config) {
    var html = clickcounter.html();
    for (var k in config) {
        if (!config.hasOwnProperty(k)) {
            continue;
        }
        html = html.split("%%" + k + "%%").join(config[k]);
    }
    clickcounter.html(html);
}

function initClickcounterPremiumStyle(clickcounter, config) {
    if (!config.isPremium()) {
        return;
    }
    var css = {
        'color': config.getFontColor(),
        'background-color': config.getBgColor()
    };
    var bg = config.getBg();
    if (bg) {
        css['background-image'] = "url('" + bg + "')";
    }
    var visual = config.getVisual();
    if (visual[0] && visual[1]) {
        clickcounter.find('.premiumVisual').css('background-image', "url('" + visual[0] + "')");
        clickcounter.find('.premiumVisualMicro').css('background-image', "url('" + visual[1] + "')");
    }
    clickcounter.css(css);
}

function addFontStyle(name, fontDef) {
    var size = parseInt(fontDef[2], 10);
    var s = '.' + name + ' { font-family: "' + fontDef[0] + '", Arial, Helvetia, sans-serif; font-weight: ' + fontDef[1] + ';';
    if (size > 0) {
        s += 'font-size: ' + size + 'px; ';
    }
    s += '}';
    $('head').append('<style type="text/css">' + s + '</style>');
}

function insertFonts(config) {
    if (!config.isPremium()) {
        return;
    }
    var fontResources = [];
    var hlFont = config.getHeadlineFont();
    var tFont = config.getTextFont();
    if (hlFont[0] && hlFont[1]) {
        fontResources.push(encodeURIComponent(hlFont[0]) + ":" + encodeURIComponent(hlFont[1]));
        addFontStyle('headlineFont', hlFont);
    }
    if (tFont[0] && tFont[1]) {
        fontResources.push(encodeURIComponent(tFont[0]) + ":" + encodeURIComponent(tFont[1]));
        addFontStyle('textFont', tFont);
    }
    if (fontResources.length > 0) {
        var fontUrl = 'http://fonts.googleapis.com/css?family=' + fontResources.join('|');
        $('head').append('<link rel="stylesheet" href="' + fontUrl + '" type="text/css">');
    }
}

var showClickCounter = function (config) {
    insertFonts(config);
    var clickCounter = $('#clickcounter');
    initClickcounterData(clickCounter, config);
    initClickcounterPremiumStyle(clickCounter, config);
    var pinkbar = clickCounter.find('.pinkbar:first');
    var barWidth = initPinkBar(clickCounter, pinkbar, config);
    $('body').css('display', 'block');
    // easeOutBack
    // easeOutElastic, 1000
    animateClickCounterEntry(clickCounter, 400, 'easeOutBack', function () {
        animateBar(pinkbar, barWidth, config, function () {
            animateClickCounterExit(clickCounter, 300, 'linear', close);
        });
    });
};

$(function () {
    registerClickHandler();
    fetchConfig(showClickCounter);
});
