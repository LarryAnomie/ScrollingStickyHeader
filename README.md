# StickyHeader
A performant scrolling sticky header implementation

Hides your header when scrolling down, slides it in when scrolling up.

Dependencies:

jQuery, Lodash/Underscore

// grab an element
var myElement = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom  = new Headroom(myElement);
