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
 * 
 *
 */


function slider() {
    let stopPosition = 20;
    let slidingTotal = document.getElementsByClassName('slider');
    for (let index = 0; index < slidingTotal.length; index++) {

        let slidingDiv = document.getElementsByClassName('slider')[0];
        console.log('POSSITION', slidingDiv.style.right);
        if (parseInt(slidingDiv.style.right) < stopPosition) {
            slidingDiv.style.right = parseInt(slidingDiv.style.right) + 5 + "px";
            setTimeout(slider, 1);
        }
    }

}

// SLIDING VIDEO
window.addEventListener("load", function () {
    let slidingTotal = document.getElementsByClassName('slider');
    for (let index = 0; index < slidingTotal.length; index++) {
        document.getElementsByClassName('slider')[index].style.display = 'block';
        document.getElementsByClassName('slider')[index].style.right = '-350px'
        // endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
        console.log('Trying to move');
        slider();
    }
});


function pause(id) {
    var player = videojs(id);
    player.ima.pauseAd();
}

function play(id) {
    var player = videojs(id);
    player.ima.resumeAd();
}

var Player = function (id, vastTag) {
    this.id = id;
    this.console = document.getElementById('ima-sample-console');
    this.playerz = videojs(id);
    this.init = function () {
        var player = videojs(this.id);

        var options = {
            id: id,
            adTagUrl: vastTag,
            adsManagerLoadedCallback: this.adsManagerLoadedCallback.bind(this),
            preload: 'auto'
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
            player.ima.initializeAdDisplayContainer();
            player.ima.requestAds();
            player.play();
        });
    }
}
Player.prototype.adsManagerLoadedCallback = function () {
    var events = [
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        google.ima.AdEvent.Type.CLICK,
        google.ima.AdEvent.Type.COMPLETE,
        google.ima.AdEvent.Type.FIRST_QUARTILE,
        google.ima.AdEvent.Type.LOADED,
        google.ima.AdEvent.Type.MIDPOINT,
        google.ima.AdEvent.Type.PAUSED,
        google.ima.AdEvent.Type.STARTED,
        google.ima.AdEvent.Type.THIRD_QUARTILE
    ];

    for (var index = 0; index < events.length; index++) {
        this.playerz.ima.addEventListener(
            events[index],
            this.onAdEvent.bind(this));
    }
};

Player.prototype.onAdEvent = function (event) {
    console.log("EVENT", event.type);
    if (event.type == 'start') {
        pause(this.id);
        console.log('PAUSED');

    }
    if (event.type == 'pause') {
        checkScroll();
    }
    if (event.type == 'allAdsCompleted') {
        let endingPlay = document.getElementById(this.id);
        endingPlay.style.visibility = 'hidden';
        endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
    }
};

var obj = document.getElementsByClassName("pilot-player");
var realHeight = [];
var realWidth = [];
for (let index = 0; index < obj.length; index++) {

    realHeight[index] = document.getElementsByClassName('pilot-player')[index].height;
    realWidth[index] = document.getElementsByClassName('pilot-player')[index].width;
    let id = obj[index].getAttribute('id');
    let vastTag = obj[index].getAttribute("value");
    console.log(id);
    console.log(vastTag);
    console.log('=============================');
    var player1 = new Player(id, vastTag);
    player1.init();
}
var videos = document.getElementsByClassName("pilot-player");
var fraction = 0.6;
let count = []

function checkScroll() {
    console.log('ID =', videos[0].getAttribute('id'));
    if (videos[0].getAttribute('data-view') !== "mobile_web") {
        for (let i = 0; i < videos.length; i++) {
            var playVideo = videos[i];
            let playId = videos[i].getAttribute('id');
            var x = playVideo.offsetLeft, y = playVideo.offsetTop, w = playVideo.offsetWidth, h = playVideo.offsetHeight, r = x + w, //right
                b = y + h, //bottom
                visibleX, visibleY, visible;
            visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
            visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));
            visible = visibleX * visibleY / (w * h);
            if (visible > fraction) {
                if (!(document.getElementsByClassName('pilot-player')[i].classList.contains('pilot-checker')) && !(playVideo.classList.contains('stuck'))) {
                    play(playId);
                    console.log('PLAY');
                }
                if ((!document.getElementsByClassName('pilot-player')[i].classList.contains('pilot-checker')) && (playVideo.classList.contains('stuck'))) {
                    count.push(i);
                    for (let index = 0; index < count.length; index++) {
                        document.getElementsByClassName('in_article')[count[index]].classList.remove("stuck");
                    }
                }
                playVideo.style.height = realHeight[i] + "px";
                playVideo.style.width = realWidth[i] + "px";
                if (document.getElementsByClassName('pilot-video')[i].classList.contains('stuck')) {
                    document.getElementsByClassName('in_article')[i].classList.remove("stuck");
                    document.getElementsByClassName('pilot-player')[i].classList.add("pilot-checker");
                }

            } else {

                if ((document.getElementById(playId).classList.contains('pilot-checker')) || (document.getElementsByClassName('pilot-video')[i].classList.contains('in_article'))) {
                    // let stuckHeight = Math.max(window.innerHeight) / 4 + "px";
                    // let stuckWidth = Math.max(window.innerWidth) / 8 + "px";
                    // playVideo.style.height = stuckHeight;
                    // playVideo.width = stuckWidth;
                    document.getElementsByClassName('in_article')[i].classList.add("stuck");
                    document.getElementsByClassName('pilot-player')[i].classList.remove("pilot-checker");

                }

            }

        }
    }
}
window.addEventListener('scroll', checkScroll, false);