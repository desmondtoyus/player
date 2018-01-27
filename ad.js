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

    if (event.type == 'allAdsCompleted') {
        document.getElementById(this.id).style.visibility = 'hidden';
    }
};
var obj = document.getElementsByClassName("pilot-player");
for (let index = 0; index < obj.length; index++) {
    // var videoHeight=[];
    var realHeight=[];
    var realWidth=[];
    //  videoHeight[index] = document.getElementsByClassName('pilot-video')[index].outerWidth;
     realHeight[index] = document.getElementsByClassName('pilot-player')[index].height;
    realWidth[index] = document.getElementsByClassName('pilot-player')[index].width;
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
var videos = document.getElementsByClassName("pilot-player");
var fraction = 0.6;
let count = []

function checkScroll() {
    console.log('ID =', videos[0].getAttribute('id'));
    if (videos[0].getAttribute('data-view') !== "mobile") {
        
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
                if (!(document.getElementsByClassName('pilot-player')[i].classList.contains('pilot-checker')) && !(document.getElementsByClassName('pilot-video')[i].classList.contains('stuck')) && !(videos[i].getAttribute('id'))) {
                    play(playId);
                    console.log('PLAY');
                }
                if ((!document.getElementsByClassName('pilot-player')[i].classList.contains('pilot-checker')) && (document.getElementsByClassName('pilot-video')[i].classList.contains('stuck'))) {
                    count.push(i);
                    for (let index = 0; index < count.length; index++) {
                        document.getElementsByClassName('pilot-video')[count[index]].classList.remove("stuck");
                    }
                }
                playVideo.style.height = realHeight[i] + "px";
                playVideo.style.width = realWidth[i] + "px";
                document.getElementsByClassName('pilot-video')[i].classList.remove("stuck");
                document.getElementsByClassName('pilot-player')[i].classList.add("pilot-checker");
            } else {
                if (!(document.getElementsByClassName('pilot-player')[i].classList.contains('pilot-checker')) && !(document.getElementsByClassName('pilot-video')[i].classList.contains('stuck')) && !(videos[i].getAttribute('id'))) {
                    pause(playId);
                    console.log('PAUSED');
                }
                if ((document.getElementById(playId).classList.contains('pilot-checker'))) {
                    let stuckHeight = Math.max(window.innerHeight) / 4 + "px";
                    let stuckWidth = Math.max(window.innerWidth) / 8 + "px";
                    playVideo.style.height = stuckHeight;
                    playVideo.style.width = stuckWidth;
                    document.getElementsByClassName('pilot-video')[i].classList.add("stuck");
                      document.getElementsByClassName('pilot-player')[i].classList.remove("pilot-checker");

                }

            }

        }
    }
}

window.addEventListener('scroll', checkScroll, false);