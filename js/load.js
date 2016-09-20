jQuery(document).ready(function($) {
    function colorize() {
        $('[class*="product_"]').on({
            click: function () {
                row = $(this).attr('class').replace(/^/,'.');
                $(this).removeClass("pinned");
                $(row).addClass("pinned");
            },
            mouseenter: function () {
                row = $(this).attr('class').replace(/^/,'.');
                $(row).css('background-color', '#4A89FF');
            },
            mouseleave: function () {
                row = $(this).attr('class').replace(/^/,'.');
                $(row).css('background-color', '');
            }
        });

        $('[class*="column_"]').on({
            mouseenter: function () {
                column = $(this).closest('.product');
                $(column).css('background-color', '#AA89FF');
            },
            mouseleave: function () {
                column = $(this).closest('.product');
                $(column).css('background-color', '');
            }
        });

        $(".true").html("");
        $(".false").html("");
        $(".null").html("");
    }

    function parseJSON(filename) {
        $.getJSON(filename, function(json) {
            //console.log(json);
            for (var object in json) break;
            $(document).attr("title", object + " :: compare");
            $(".header").text(object);

            property = Object.keys(json[object][0]);
            //console.log(property)
            for(var i = property.length-1; i--;){
                if (property[i] === "id") property.splice(i, 1);
                if (property[i] === "image") property.splice(i, 1);
                if (property[i] === "name") property.splice(i, 1);
            }

            $.each(property, function() {
                $(".cd-features-list").append('<li class="product_' + this.replace(" ", "-") + ' ">' + this.toUpperCase() + '</li>');
            });

            $.each(json[object], function() {
                product = '<li class="product">\n\t<div class="top-info">\n\t\t<div class="check"></div>';

                if ("image" in this) {
                    product = product + '\n\t\t<img class="column_image" src="' + this.image + '" alt="product image">';
                }
                if ("name" in this) {
                    product = product + '\n\t\t<h3 class="column_name">' + this.name + '</h3>\n\t</div>';
                }

                product = product + '\n\t<ul class="cd-features-list">';

                $.each(property, $.proxy(function(index, item) {
                    value = this[item];

                    if (value.toString().toLowerCase() === "false") {
                        product = product + '\n\t\t<li class="product_' + item.replace(" ", "-") + ' false">' + this[item] + '</li>';
                    }
                    else if (value.toString().toLowerCase() === "true") {
                        product = product + '\n\t\t<li class="product_' + item.replace(" ", "-") + ' true">' + this[item] + '</li>';
                    }
                    else if (value.toString().toLowerCase() === "null") {
                        product = product + '\n\t\t<li class="product_' + item.replace(" ", "-") + ' null">' + this[item] + '</li>';
                    }
                    else {
                        product = product + '\n\t\t<li class="product_' + item.replace(" ", "-") + ' string">' + this[item] + '</li>';
                    }
                }, this));

                product = product + '\n\t</ul></li>';

                //console.log(product)
                $(".cd-products-columns").append(product);
            });

            colorize();

            $.getScript("../js/main.js", function() {
               console.log("Load compare script");
            });
        });
    }

    var failsafe = "models.json";
    var urlhash = (window.location.search).substring(1).split("=")[1];

    if (typeof urlhash === "undefined") {
        parseJSON(failsafe);
    }
    else {
        filename = urlhash + ".json";
        console.log("Loading", filename);

        $.get(filename)
            .done(function() {
                parseJSON(filename);
            })
            .fail(function() {
                parseJSON(failsafe);
            }
        );
    }

});
