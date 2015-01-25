(function() {

  var StickyHeader = function($el) {

    if ( !(this instanceof StickyHeader) ) {
        return new Header( $el );
    }

    // cached DOM

    this.$el = $el;
    this.window = window;
    this.$window = $(window);

    this.$nav = this.$el.find('.js-header-nav');
    this.$toggler = this.$el.find('.js-header-toggler');
    this.$content = $('.content');

    // header hidden class
    this.classHidden = 'header--hidden';
    // header visible class
    this.classVisible = 'header--visible';
    // header expanded class
    this.classExpanded = 'header--expanded';

    // variables

    this.ticking = false;
    this.latestKnownScrollY = 0;
    this.previousY = 0;
    this.isOpen = false;

    // constants

    this.HEADER_HEIGHT = 82; // gets hidden once scrolled past this point
    this.THROTTLE = 5; // ensure a user scrolls more than this many pixels before show/hidding header

    this._init();

  }

  StickyHeader.prototype._init = function () {

    console.log('init')
      // attach scroll event to window
      this.$window.on( 'scroll', _.bind( this._onScroll, this ) );

      // attach click event to toggler
      this.$toggler.on( 'click', _.bind( this._onClick, this ) );

      // kick off
      requestAnimationFrame(_.bind( this._update, this ));


  };

  StickyHeader.prototype._requestTick = function() {
      if (!this.ticking) {
          requestAnimationFrame(_.bind( this._update, this ));
      }
      this.ticking = true;
  };

  StickyHeader.prototype._update = function() {
      // reset the tick so we can
      // capture the next onScroll
      this.ticking = false;

      console.log('update')

      if (!this.$el.hasClass(this.classExpanded)) { // don't need to calculate when header is exapanded

          if (this.latestKnownScrollY > this.HEADER_HEIGHT) { // scrolled past the header

            if (this.latestKnownScrollY < this.previousY) { // scrolling up

              this.$el.removeClass(this.classHidden).addClass(this.classVisible);

            } else { // scrolling down

              this.$el.removeClass(this.classVisible).addClass(this.classHidden);
            }

          } else if (this.latestKnownScrollY <= 0) { // at the top of the page

            this.$el.removeClass(this.classVisible).removeClass(this.classHidden);
          }

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

  StickyHeader.prototype._onClick = function(e) {

      var $self = $(e.target);

      e.preventDefault();

      this.$el.toggleClass(this.classExpanded);

      this.$toggler.toggleClass('active');
  };


  var stickyHeader = new StickyHeader($('.js-header'));


}());
