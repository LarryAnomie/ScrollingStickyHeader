# Scrolling Sticky Header

A performant scrolling sticky header implementation that uses RequestAnimationFrame to debounce scroll events and css transitions for animation.

Hides your header when scrolling down, slides it in when scrolling up.

Dependencies:

* jQuery

**Quick Setup**

Install node dependencies: 

    npm install
    
Install front-end dependencies:

    bower install
    
Quickly run a local server:

    grunt serve

**Usage**

    var stickyHeader = new StickyHeader($('.js-header'));
