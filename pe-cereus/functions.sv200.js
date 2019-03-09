'use strict';
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $('html').addClass('ismobile')
}
$(document).ready(function() {
    function scrollBar(selector, theme, mousewheelaxis) {
        $(selector).mCustomScrollbar({
            theme: theme,
            scrollInertia: 100,
            axis: 'yx',
            mouseWheel: {
                enable: false,
                axis: mousewheelaxis,
                preventDefault: false
            }
        })
    }
    if (!$('html').hasClass('ismobile')) {
        if ($('.c-overflow')[0]) {
            scrollBar('.c-overflow', 'minimal-dark', 'y')
        }
    }
    if ($('.navigation__sub')[0]) {
        $('body').on('click', '.navigation__sub > a', function(e) {
            e.preventDefault();
            $(this).closest('.navigation__sub').toggleClass('navigation__sub--toggled');
            $(this).parent().find('ul').stop().slideToggle(250)
        })
    }
    if ($('.top-search')[0]) {
        $('body').on('focus', '.top-search__input', function() {
            $('.top-search').addClass('top-search--focused')
        });
        $('body').on('click', '.top-menu__trigger > a', function(e) {
            e.preventDefault();
            $('.top-search').addClass('top-search--focused');
            $('.top-search__input').focus()
        });
        $('body').on('click', '.top-search__reset', function() {
            $('.top-search').removeClass('top-search--focused ');
            $('.top-search__input').val('')
        });
        $('body').on('blur', '.top-search__input', function() {
            var x = $(this).val();
            if (!x.length > 0) {
                $('.top-search').removeClass('top-search--focused')
            }
        })
    }
    if ($('.collapse')[0]) {
        $('.collapse').on('show.bs.collapse', function(e) {
            $(this).closest('.panel').find('.panel-heading').addClass('active')
        });
        $('.collapse').on('hide.bs.collapse', function(e) {
            $(this).closest('.panel').find('.panel-heading').removeClass('active')
        });
        $('https://download.pixelexperience.org/js/inc/.collapse.in').each(function() {
            $(this).closest('.panel').find('.panel-heading').addClass('active')
        })
    }
    if ($('html').hasClass('ie9')) {
        $('input, textarea').placeholder({
            customClass: 'ie9-placeholder'
        })
    }
    var $body = $('body');
    var $this = $(this);
    var target;
    $body.on('click', '[data-mae-action]', function(e) {
        var action = $(this).data('mae-action');
        e.preventDefault();
        switch (action) {
            case 'block-open':
                target = $(this).data('mae-target');
                $(target).addClass('toggled');
                $body.addClass('block-opened');
                $body.append('<div data-mae-action="block-close" data-mae-target="' + target + '" class="mae-backdrop mae-backdrop--sidebar" />')
                break;
            case 'block-close':
                $(target).removeClass('toggled');
                $body.removeClass('block-opened');
                $('.mae-backdrop--sidebar').remove();
                break;
            case 'open-download-modal':
                var modal_id = $(this).data('modal-id');
                $("#" + modal_id).modal('show');
                break;
            case 'download':
                var modal_id = $(this).data('modal-id');
                $("#" + modal_id).modal('hide');
                var file_uid = $(this).data('file-uid');
                var file_name = $(this).data('file-name');
                var device_codename = $(this).data('device-codename');
                startDownload(file_uid, file_name, device_codename);
                break
        }
    })
});

function startDownload(file_uid, file_name, device_codename) {
    $.ajax({url: "/download/" + file_uid, success: function(result){
        if (result == "1"){
            result = "https://downloads.sourceforge.net/project/pixelexperience/" + device_codename + "/" + file_name + "?r=&ts=" + Math.floor(Date.now() / 1000);
        }else{
            result = "https://get.pixelexperience.org/get_file/" + result + "/";
        }
        var link = document.createElement('a');
        link.href = result;
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        showSuccessDownload(file_uid, file_name, device_codename);
    }, error: function(result){
        location.reload();
    }});
    swal({
        icon: "info",
        text: "Contacting server...",
        closeOnClickOutside: true,
        closeOnEsc: true
    });
    $(".swal-icon").replaceWith("<div style='padding:50px;'><div class='preloader preloader--xl preloader--light'><svg viewBox='25 25 50 50'><circle cx='50' cy='50' r='20'></circle></svg></div></div>");
    $(".swal-text").html("<center>Contacting server...<br><br><a href=\"https://www.packet.com/\" target=\"_blank\"><img src=\"https://aosiprom.com/img/packet.png\" alt=\"\"><br><i style=\"color:#384c63\"></a>Hosted on <a href=\"https://www.packet.com/\" target=\"_blank\">Packet.com</a> - Cloud &amp; Edge Computing Infrastructure Provider</i></center>");
    $(".swal-button-container").remove();
}

function showSuccessDownload(file_uid, file_name, device_codename) {
    swal({
        icon: "success",
        title: "Download started",
        text: "Your download should already have started",
        closeOnClickOutside: true,
        closeOnEsc: true,
        buttons: {
            retry: {
                text: "Not started? Try again",
                value: "retry",
            },
            confirm: true
        }
    }).then((value) => {
        if (value == "retry") {
            window.location.href = "https://download.pixelexperience.org/changelog/" + device_codename + "/" + file_name + "/"
        }
    });
}

function getSearchHints(hints) {
    var result = [];
    for (var i = 0; i < hints.length; i++) {
        result.push(hints[i].text)
    }
    return result
}

function getCodenameByHint(hints, hint) {
    for (var i = 0; i < hints.length; i++) {
        if (hints[i].text == hint) {
            return hints[i].codename
        }
    }
    return ""
}