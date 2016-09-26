var flash = {
    show: function(type, message, timeout) {
        var alertClass = 'alert-' + type;
        $('.alerts .' + alertClass).remove();

        var alertDiv = $('<div class="alert text-left ' + alertClass + '" style="display: none"></div>');
        var closeBtn = $('<button type="button" class="close"><span aria-hidden="true">&times;</span></button>');
        closeBtn.click(function() { $(this).parent().hide('fade'); });
        alertDiv.append(closeBtn);
        alertDiv.append(message);

        $('.alerts').append(alertDiv);
        alertDiv.show('fade');

        if (isDef(timeout)) {
            setTimeout(function() { closeBtn.click(); }, timeout);
        }
    },

    close: function (alertDiv) {
        $(alertDiv).hide('fade');
    },

    closeAll: function() {
        $('.alert').each(function() { flash.close(this); });
    },

    info: function(message, timeout) {
        flash.show('info', message, timeout);
    },

    error: function(message, timeout) {
        flash.show('danger', message, timeout);
    }
};
