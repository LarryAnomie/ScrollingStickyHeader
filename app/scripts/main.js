/* global $, _ */

(function(w, $) {

    'use strict';

    var StickyHeader = function($el) {

        if (!(this instanceof StickyHeader)) {
            return new StickyHeader($el);
        }

        // cached DOM
        this.$el = $el;
        this.window = w;
        this.$window = $(this.window);

        // css classes
        this.classHidden = 'header--hidden';         // header hidden class
        this.classVisible = 'header--visible';       // header visible class

        // variables
        this.ticking = false;
        this.latestKnownScrollY = 0;
        this.previousY = 0;

        // constants
        this.HEADER_HEIGHT = this.$el.height(); // gets hidden once scrolled past this point

        // kick off
        this._init();

    };

    StickyHeader.prototype._init = function() {

        // attach scroll event to window
        this.$window.on('scroll', _.bind(this._onScroll, this));

    };

    StickyHeader.prototype._requestTick = function() {
        if (!this.ticking) {
            requestAnimationFrame(_.bind(this._update, this));
        }
        this.ticking = true;
    };

    StickyHeader.prototype._update = function() {
        // reset the tick so we can
        // capture the next onScroll
        this.ticking = false;

        if (this.latestKnownScrollY > this.HEADER_HEIGHT) { // scrolled past the header

            if (this.latestKnownScrollY < this.previousY) { // scrolling up

                this.$el.removeClass(this.classHidden).addClass(this.classVisible);

            } else { // scrolling down

                this.$el.removeClass(this.classVisible).addClass(this.classHidden);
            }

        } else if (this.latestKnownScrollY <= 0) { // at the top of the page

            this.$el.removeClass(this.classVisible).removeClass(this.classHidden);
        }

        // if user is at the bottom of page show header
        if ((window.innerHeight + this.latestKnownScrollY) >= document.body.offsetHeight) {
            this.$el.removeClass(this.classHidden);
        }

        this.previousY = this.latestKnownScrollY;
    };

    StickyHeader.prototype._onScroll = function() {
        this.previousY = this.latestKnownScrollY;
        this.latestKnownScrollY = window.scrollY; // current scroll position
        this._requestTick();
    };

    var stickyHeader = new StickyHeader($('.js-header'));

}(window, $));
