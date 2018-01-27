/**
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function pause(id) {
    var player = videojs(id);
    player.ima.pauseAd();
}

function play(id) {
    var player = videojs(id);
    player.play();
}

var Player = function (id, vastTag) {
    this.id = id;
    this.init = function () {
        var player = videojs(this.id);

        var options = {
            id: id,
            adTagUrl: vastTag
        };

        player.ima(options);

        // Remove controls from the player on iPad to stop native controls from stealing
        // our click
        var contentPlayer = document.getElementById(id + '_html5_api');
        if ((navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Android/i)) &&
            contentPlayer.hasAttribute('controls')) {
            contentPlayer.removeAttribute('controls');
        }

        // Initialize the ad container when the video player is clicked, but only the
        // first time it's clicked.
        var startEvent = 'click';
        if (navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Android/i)) {
            startEvent = 'touchend';
        }

        player.one(startEvent, function () {
            alert('hello I am being tapped from mobile'); player.ima.initializeAdDisplayContainer();
            player.ima.requestAds();
            player.play();
        });
    }
}



var obj = document.getElementsByClassName("pilot-player");

for (let index = 0; index < obj.length; index++) {
    // let someimage = document.getElementById('this_one');
    let id = obj[index].getAttribute('id');

    let vastTag = obj[index].getAttribute("value");

    console.log(id);
    console.log(vastTag);
    // invokeVideoPlayer(playerId, vastTag, playerVolume);
    console.log('=============================');
    var player1 = new Player(id, vastTag);
    player1.init();
}


///

var videos = document.getElementsByClassName("pilot-player");
var fraction = 0.6;
function checkScroll() {

    for (var i = 0; i < videos.length; i++) {

        var playVideo = videos[i];
        var id = videos[i].getAttribute('id');
        var x = playVideo.offsetLeft, y = playVideo.offsetTop, w = playVideo.offsetWidth, h = playVideo.offsetHeight, r = x + w, //right
            b = y + h, //bottom
            visibleX, visibleY, visible;

        visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
        visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));

        visible = visibleX * visibleY / (w * h);

        if (visible > fraction) {
            // playVideo.play();
            play(id)
            console.log('Attempting to play');

        } else {

        }

    }

}

window.addEventListener('scroll', checkScroll, false);
window.addEventListener('resize', checkScroll, false);