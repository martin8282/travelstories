var app = {
  current_frame: null,
  
  loadFrame: function(frameName, complete) {
    $.ajax({
      url: 'frames/' + frameName + '.html',
      method: 'get',
      success: complete
    })
  },
  
  navigate: function(frameName) {
    var body = $('body');
    
    var slide = function(oldFrame, newFrame, onComplete) {
      oldFrame.css({ 'left': 0, 'z-index': 0 }).removeClass('current');
      
      newFrame
        .addClass('moving')
        .height($(window).height())
        .removeClass('hidden');
      
      var animationComplete = function() {
        onComplete(oldFrame, newFrame);
      };
  
      newFrame.animate({ left: '0' }, { duration: 300, complete: animationComplete });
    };
    
    var complete = function(oldFrame, newFrame) {
      if (oldFrame) oldFrame.addClass('hidden').removeAttr('style');
      newFrame.attr('id', frameName).removeClass('moving').addClass('current').removeAttr('style');
  
      body.css('overflow', 'auto');
    };
  
    var process = function(newFrame) {
      body.css('overflow', 'hidden');
      
      var oldFrame = $('.frame.current');
      
      if (oldFrame.length) {
        slide(oldFrame, newFrame, complete);
      }
      else {
        complete(null, newFrame);
      }
    };
    
    var onLoadFrame = function(response) {
      var newFrame = $(response);
      body.append(newFrame);
      process(newFrame);
    };
  
    var newFrame = $('#' + frameName);
    if (newFrame.length) {
      process(newFrame)
    }
    else {
      app.loadFrame(frameName, onLoadFrame)
    }
  }
};
