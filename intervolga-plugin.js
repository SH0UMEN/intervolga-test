(function ($) {
    class Row {
        constructor(row) {
            this.rowsWithEls = [];
            let elements = $(row).find('.thumbnail');
            this.fillRows(elements, 3);

            for(let tRow of this.rowsWithEls) {
                let maxImgHeight = 0,
                    maxImgIndex,
                    maxCaptionHeight = 0,
                    maxCaptionIndex;

                //Поиск элементов с максимальными высотами
                tRow.forEach((el, i) => {
                    let imgHeight = $(el).find('img').height(),
                        capHeight = $(el).find('.caption').innerHeight();
                    this.wrapImg(el);

                    if(imgHeight > maxImgHeight) {
                        maxImgHeight = imgHeight;
                        maxImgIndex = i;
                    }

                    if(capHeight > maxCaptionHeight) {
                        maxCaptionHeight = capHeight;
                        maxCaptionIndex = i;
                    }
                });

                //Правка высот
                for(let el of tRow) {
                    $(el).find('.img-wrapper').css('height', maxImgHeight+"px");
                    $(el).find('.caption').css('height', maxCaptionHeight+"px");
                }

                //Изменение размеров при ресайзе
                $(window).on('resize', function (e) {
                    let caption = $(tRow[maxCaptionIndex]).find('.caption'),
                        captionPT = parseInt($(caption).css('padding-top')),
                        captionPB = parseInt($(caption).css('padding-bottom'));
                    maxCaptionHeight = captionPB + captionPT ;
                    maxImgHeight = $(tRow[maxImgIndex]).find('img').height();
                    $(tRow[maxCaptionIndex]).find('.caption > *').each(function () {
                       maxCaptionHeight += $(this).outerHeight(true);
                    });
                    for(let el of tRow) {
                        $(el).find('.img-wrapper').css('height', maxImgHeight+"px");
                        $(el).find('.caption').css('height', maxCaptionHeight+"px");
                    }
                });
            }

            //Правка стилей для корректного отображения
            $('.img-wrapper').css('display', 'flex').css('align-items', 'center');
            $('.caption').css('display', 'flex').css('flex-direction', 'column').css('justify-content', 'space-between');
        }

        //Обернуть изображение флексом
        wrapImg(el) {
            $(el).find('img').css('max-width', '100%').css('margin', 'auto').css('height', 'auto').wrap('<div class="img-wrapper"></div>');
        }

        //Разбиение всего массива элементов на заданное количество строк
        fillRows(elements, elsInRow) {
            let rowsWithEls = this.rowsWithEls,
                tRow = [];

            $(elements).each(function(i) {
                if (tRow.length < elsInRow) {
                    tRow.push(this);
                } else {
                    rowsWithEls.push(tRow);
                    tRow = [];
                    tRow.push(this);
                }
                if(i == $(elements).length-1) {
                    rowsWithEls.push(tRow);
                }
            })

            this.rowsWithEls = rowsWithEls;
        }
    }

    $.fn.fixHeight = function () {

        function main(e) {
            new Row(e);
        }

        $(this).each(function () {
            main($(this));
        });
        return this;
    };
})(jQuery);