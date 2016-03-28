/*
 * Backbone SPA
 *
 * Author: Cristian Maghiar
 * Email: cristi@uix.ro
 *
 */

(function () { "use strict";

    // Global class
    var BB = BB || {};

    // URIs
    var rootURL = Backbone.history.location.origin;
    var themeURL = rootURL + '/wp-content/themes/backbone-spa/';
    
    console.log(themeURL);

    // Top-level variable references in our Underscore.js templates
    _.templateSettings.variable = "backbone-spa";

    // REST API root url for Ajax driven calls...
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.url = rootURL + '/wp/v2/' + options.url;
    });



    // MODELS, COLLECTIONS

    // Post Model -> Get the post by ID
    BB.Post = Backbone.Model.extend({
        url: 'posts'
    });



    // VIEWS

    // Backbone close method for unbinding the ghost views
    Backbone.View.prototype.close = function () {
        if (this.beforeClose) this.beforeClose();
        this.remove().unbind();
    };

    // Header View
    BB.HeaderView = Backbone.View.extend({
        initialize: function () {
            this.template = _.template($('#header-tpl').html());
        },

        render: function () {
            this.$el.html(this.template);
            return this.$el;
        }
    });

    // HomePage View
    BB.HomePageView = Backbone.View.extend({
        initialize: function () {
            this.template = _.template($('#home-page-tpl').html());
        },

        render: function () {
            this.$el.html(this.template);
            return this.$el;
        }
    });

    // Footer View
    BB.FooterView = Backbone.View.extend({
        initialize: function () {
            this.template = _.template($('#footer-tpl').html());
        },

        render: function () {
            this.$el.html(this.template);
            return this.$el;
        }
    });


    // ROUTER/CONTROLLER

    // Application Router/ Controller
    BB.AppRouter = Backbone.Router.extend({
        routes: {
            '': 'homePage',
            '*notFound': 'notFound'
        },

        initialize: function () {
            // instantiate header
            this.headerView = new BB.HeaderView();
            $('#header').html(this.headerView.render());

            // instantiate footer
            this.footerView = new BB.FooterView();
            $('#footer').html(this.footerView.render());
        },

        homePage: function () {
            this.showView('#yield', new BB.HomePageView());
        },

        notFound: function () {
            this.navigate('', {trigger: true})
        },

        showView: function (selector, view) {
            // unbind the current view to prevent ghost views
            if (this.currentView) {
                this.currentView.close();
            }

            // RENDER the VIEW on ROUTER CHANGE!
            $(selector).html(view.render());
            this.currentView = view;

            return view;
        }
    });

    BB.App = new BB.AppRouter();
    Backbone.history.start();



    // PRIVATE FUNCTIONS

    // General DOM Manipulation
    (function () {
        $(document).ready(function () {
            // the document width
            var ww = $(window).width();
            var wh = $(window).height();

            // sticky footer
            $(window).bind(' load resize orientationChange ', function () {
                var footer = $("#footer");
                var pos = footer.position();

                wh = wh - pos.top;
                wh = wh - footer.height() - 1;

                if (wh > 0) {
                    footer.css('margin-top', wh + 'px');
                }
            });
            
            // iframe wrappers
            $( 'iframe[src*="youtube.com"]').wrap("<div class='flex-video widescreen'/>");
            $( 'iframe[src*="vimeo.com"]').wrap("<div class='flex-video widescreen vimeo'/>");

            // Initializes Foundation.js
            $(document).foundation();

        });
    })();

    // Loading
    function loading() {
        if (arguments.length === 0 || arguments[0] === true) {
            $('#loading').addClass('is-loading');
            $('body').addClass('is-loading');
        } else {
            setTimeout(function () {
                $('#loading').removeClass('is-loading');
                $('body').removeClass('is-loading');
            }, 300);
        }
    }
})();
