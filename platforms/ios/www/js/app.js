var app = {
  init: function () {
    window.onerror = app.onError;
    document.addEventListener('deviceready', app.onAppStart, false);
  },

  onAppStart: function() {
    app.navigateTo(consts.PAGE_LOGIN);
  },

  get: function(key) {
    if (!isDef(window.store)) window.store = {};
    return window.store[key];
  },

  set: function(key, value) {
    if (!isDef(window.store)) window.store = {};
    window.store[key] = value;
  },

  currentPage: function(pageName) {
    if (isDef(pageName)) {
      app.set(consts.KEY_PREVIOUS_PAGE, app.get(consts.KEY_CURRENT_PAGE));
      app.set(consts.KEY_CURRENT_PAGE, pageName);
      return pageName;
    }
    else {
      return app.get(consts.KEY_CURRENT_PAGE);
    }
  },

  previousPage: function() {
    return app.get(consts.KEY_PREVIOUS_PAGE);
  },

  onError: function(message, url, line, col, error) {
    utils.unmask();
    if (app.isDebug()) {
      alert(message);
      //flash.error(message);
    }
    else {
      //utils.sendError(message);
    }
  },

  isDebug: function() {
    return true;
  },

  loadFrame: function (frameName, complete) {
    $.ajax({
      url: 'frames/' + frameName + '.html',
      method: 'get',
      success: function(response) {
        var newFrame = $(response);
        $('body').append(newFrame);

        if (isDef(complete)) complete(newFrame);
      }
    })
  },

  navigateTo: function (pageName, complete) {
    var body = $('body');

    var slide = function (oldFrame, newFrame, onComplete) {
      oldFrame.css({'left': 0, 'z-index': 0}).removeClass('current');

      var winHeight = $(window).height();
      var scrollTop = $(window).scrollTop();

      newFrame.addClass('moving').css({top: scrollTop, height: winHeight}).removeClass('hidden');

      var animationComplete = function () {
        onComplete(oldFrame, newFrame);
      };

      newFrame.animate({left: '0'}, {duration: 400, complete: animationComplete});
    };

    var processComplete = function (oldFrame, newFrame) {
      if (oldFrame) oldFrame.addClass('hidden').removeAttr('style');

      newFrame.attr('id', pageName)
        .removeClass('moving')
        .addClass('current')
        .removeAttr('style');

      //body.css('overflow', 'auto');

      if (pageName != app.currentPage()) {
        app.currentPage(pageName);

        var pageObject = eval(pageName);
        pageObject.init();
      }
      if (isDef(complete)) complete(newFrame);
    };

    var process = function(newFrame) {
      //body.css('overflow', 'hidden');

      var oldFrame = $('.frame.current');

      if (oldFrame.length) {
        slide(oldFrame, newFrame, processComplete);
      }
      else {
        processComplete(null, newFrame);
      }
    };

    var newFrame = $('#' + pageName);
    if (newFrame.length) {
      process(newFrame)
    }
    else {
      app.loadFrame(pageName, process)
    }
  },

  navigateBack: function() {
    var prevPage = app.get(consts.KEY_PREVIOUS_PAGE);
    if (prevPage != null && app.currentPage() != prevPage) app.navigateTo(prevPage);
  }
};

app.init();
