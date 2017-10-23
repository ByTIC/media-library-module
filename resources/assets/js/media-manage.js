document.addEventListener("DOMContentLoaded", function () {

    var MediaLibrary = function (element) {
        this.$panel = $(element);
        this.$uploadModal = this.$panel.find('.modal[role="dialog"]');
        this.init();
    };

    MediaLibrary.prototype.init = function () {
        this.hookUploadModal(this.$uploadModal);
        this.hookMediaActions();
    };

    MediaLibrary.prototype.hookUploadModal = function (element) {
        this.$uploadModal = $(element);

        this.$uploadModal.on('hidden.bs.modal', $.proxy(this.closeModal, this));
    };

    MediaLibrary.prototype.hookMediaActions = function () {
        this.$panel.find('.gallery-item a.set-default').click($.proxy(this.setDefaultMedia, this));
        this.$panel.find('.gallery-item a.negative').click($.proxy(this.removeMedia, this));
    };

    MediaLibrary.prototype.closeModal = function (e) {
        location.reload();
    };

    MediaLibrary.prototype.setDefaultMedia = function (event) {
        event.stopPropagation();

        var element = $(event.target);
        var link = element.parents('a');
        var galleryItem = element.parents('.gallery-item');
        var overlay = galleryItem.find('.overlay');

        overlay.show().fadeTo('fast', 0.7);

        $.ajax({
            url: link.attr('data-url'),
            type: "POST",
            data: {
                media_type: link.attr('data-type'),
                media_filename: link.attr('data-filename'),
            },
            context: this
        }).done(function (response) {
            this.$panel.find('.gallery-item').removeClass('default');
            galleryItem.addClass("default");
            overlay.hide();

            if (response.type == 'success') {
                $.jGrowl("Imaginea a fost stabilita ca principala", {header: "Confirmare"});
            } else {
                $.jGrowl("Imaginea nu a putut fi stabilita ca principala", {header: "Eroare"});
            }
        });
    };

    MediaLibrary.prototype.removeMedia = function (event) {
        event.stopPropagation();

        var element = $(event.target);
        var link = element.parents('a');
        var galleryItem = element.parents('.gallery-item');
        var overlay = galleryItem.find('.overlay');

        if (confirm("Sunteti sigur(a)?")) {
            overlay.show().fadeTo('fast', 0.7);

            $.ajax({
                url: link.attr('data-url'),
                type: "POST",
                data: {
                    media_type: link.attr('data-type'),
                    media_filename: link.attr('data-filename'),
                },
                context: document.body
            }).done(function (response) {
                if (response.type == 'success') {
                    galleryItem.remove();
                    $.jGrowl("Imaginea a fost stearsa", {header: "Confirmare"});
                } else {
                    $.jGrowl("Imaginea nu a putut fi stearsa", {header: "Eroare"});
                }

                if ($('.gallery-item').size() == 0) {
                    $('item-gallery').find('.alert-info').show();
                }
            });
        }
    };

    MediaLibrary.setDefaultCover = function (event) {
        event.stopPropagation();

        var element = $(event.target);
        var galleryItem = element.parents('.gallery-item');
        var overlay = galleryItem.find('.overlay');


        overlay.show().fadeTo('fast', 0.7);

        $.ajax({
            url: MediaLibrary.setDefaultCoverURL,
            type: "POST",
            data: {image: element.attr('rel')},
            context: document.body
        }).done(function (response) {

            $('.gallery-item').removeClass('default');
            galleryItem.addClass("default");
            overlay.hide();

            if (response.type == 'success') {
                $.jGrowl(response.message, {header: "Confirmare"});
            } else {
                $.jGrowl(response.message, {header: "Eroare"});
            }
        });
    };

    MediaLibrary.removeCover = function (event) {
        event.stopPropagation();

        var galleryItem = $(event.target).parents('.gallery-item');
        var element = galleryItem.find('a.negative');
        var overlay = galleryItem.find('.overlay');

        if (confirm("Sunteti sigur(a)?")) {
            overlay.show().fadeTo('fast', 0.7);

            $.ajax({
                url: MediaLibrary.removeCoverURL,
                type: "POST",
                data: {image: element.attr('rel')},
                context: document.body
            }).done(function (response) {
                if (response.type == 'success') {
                    galleryItem.remove();
                    $.jGrowl("Imaginea a fost stearsa", {header: "Confirmare", themeState: "default"});
                } else {
                    $.jGrowl("Imaginea nu a putut fi stearsa", {header: "Eroare"});
                }

                if ($('.gallery-item').size() == 0) {
                    $('item-gallery').find('.alert-info').show();
                }
            });
        }
    };

    // MediaLibrary DATA-API
    // ==============
    $.fn.MediaLibrary = function () {
        this.each(function () {
            new MediaLibrary(this);
        });
    };

    $('.medialibrary-panel').each(function () {
        $(this).MediaLibrary();
    });
});