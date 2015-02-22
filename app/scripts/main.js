/* global $, _ */

(function(w, $) {

    'use strict';

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel

    // MIT license

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    /**
     * A module to hide and show a header based on user scrolling
     * @constructor
     */
    var StickyHeader = function($el) {

        // ensure fn is called with new
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
        this.latestScrollY = 0;
        this.previousY = 0;

        // constants
        this.HEADER_HEIGHT = this.$el.height(); // gets hidden once scrolled past this point

        // kick off
        this._init();

    };

    /**
     * kick off
     */
    StickyHeader.prototype._init = function() {

        // attach scroll event to window
        this.$window.on('scroll', this._onScroll.bind(this));

    };

    /**
     * shows header
     */
    StickyHeader.prototype._stick = function() {
        this.$el.removeClass(this.classHidden).addClass(this.classVisible);
    };

    /**
     * hides header
     */
    StickyHeader.prototype._unStick = function() {
        this.$el.removeClass(this.classVisible).addClass(this.classHidden);
    };

    /**
     * figures out whether we need to hide or show the header
     * called inside a requestAnimationFrame
     */
    StickyHeader.prototype._update = function() {
        // reset the tick so we can capture the next onScroll
        this.ticking = false;

        if (this.latestScrollY > this.HEADER_HEIGHT) { // scrolled past the header

            if (this.latestScrollY < this.previousY) { // scrolling up

                this._stick();

            } else { // scrolling down

                this._unStick();
            }

        } else if (this.latestScrollY <= 0) { // at the top of the page

            this.$el.removeClass(this.classVisible).removeClass(this.classHidden);
        }

        // if user is at the bottom of page show header
        if ((window.innerHeight + this.latestScrollY) >= document.body.offsetHeight) {
            this.$el.removeClass(this.classHidden);
        }

        this.previousY = this.latestScrollY; // update our Y position record
    };

    /**
     * checks whether an update is currently taking place, if not calls an update
     * via requestAnimationFGrame
     */
    StickyHeader.prototype._requestTick = function() {
        if (!this.ticking) {
            requestAnimationFrame(this._update.bind(this));
        }

        this.ticking = true;
    };

    /**
     * scroll handler
     * updates perviousY record and sets latestY record to current scroll position
     * calls requestTick
     */
    StickyHeader.prototype._onScroll = function() {
        this.previousY = this.latestScrollY;
        this.latestScrollY = window.scrollY; // current scroll position
        this._requestTick();
    };

    // instantiate the module
    var stickyHeader = new StickyHeader($('.js-header'));

}(window, $));
