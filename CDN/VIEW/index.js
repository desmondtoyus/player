// function isElementInViewport(el) {
//     var rect = el.getBoundingClientRect();
//     return (
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
// }


function checkInView(elem, partial) {
    // var container = $(".scrollable");
    // var container = document.getElementsByClassName()
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight;

    var elemTop = $(elem).offset().top - container.offset().top;
    var elemBottom = elemTop + $(elem).height();

    var isTotal = (elemTop >= 0 && elemBottom <= contHeight);
    var isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= container.height())) && partial;

    return isTotal || isPart;
}



// function parents(element, _array) {
//     if (_array === undefined) _array = []; // initial call
//     else _array.push(element); // add current element
//     // do recursion until BODY is reached
//     if (element.tagName !== 'BODY') return parents(element.parentNode, _array);
//     else return _array;
// }
// Usage:

// var parentsArray = parents(document.getElementById("myDiv"));