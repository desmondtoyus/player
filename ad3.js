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


let addclose = document.getElementsByClassName('pilot-video');
for (let index = 0; index < addclose.length; index++) {
    let c = document.getElementsByClassName('pilot-video')[index];
    let id = c.childNodes[1].id;
    console.log('VALUEi,' + id)


    let closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&#10006;'
    closeBtn.id = 'close-' + id;
    closeBtn.classList.add('pilot-closeBtn');
    closeBtn.addEventListener("click", function (e) {
        // let toClose = e.target.getAttribute("id")
        // document.getElementsByClassName('pilot-video')[toClose].style.display = 'none';
        videojs(id).ima.getAdsManager().setVolume(0);
        document.getElementById(id).parentNode.style.display = 'none';
    });

    let playBtn = document.createElement('div');
    playBtn.innerHTML = '&#9658;'
    playBtn.id = 'play-' + index;
    // playBtn.setAttribute("data-player", id);
    playBtn.classList.add('pilot-closeBtn');
    playBtn.addEventListener("click", function (e) {
        play(id);
    });

    let pauseBtn = document.createElement('div');
    pauseBtn.innerHTML = '&#10074;&#10074;'
    pauseBtn.id = 'pause-' + index;
    // playBtn.setAttribute("data-player", id);
    pauseBtn.classList.add('pilot-closeBtn');
    pauseBtn.addEventListener("click", function (e) {
        pause(id);
    });

    let cont = document.createElement('span');
    cont.appendChild(closeBtn);
    cont.appendChild(playBtn);
    cont.appendChild(pauseBtn);



    // addclose[index].appendChild(closeBtn);
    addclose[index].insertBefore(cont, addclose[index].firstChild)

}

// function close(e) {

// }

function pilotSlider() {
    let stopPosition = 20;
    let slidingTotal = document.getElementsByClassName('pilot-video slider');
    for (let index = 0; index < slidingTotal.length; index++) {

        let slidingDiv = document.getElementsByClassName('pilot-video slider')[0];
        console.log('POSITION', slidingDiv.style.right);
        if (parseInt(slidingDiv.style.right) < stopPosition) {
            slidingDiv.style.right = parseInt(slidingDiv.style.right) + 10 + "px";
            setTimeout(pilotSlider, 0.5);
        }
    }

}

// SLIDING VIDEO
if (document.getElementsByClassName('pilot-video')[0].classList.contains('slider')) {
    let slidingTotal = document.getElementsByClassName('pilot-video slider');
    for (let index = 0; index < slidingTotal.length; index++) {
        document.getElementsByClassName('pilot-video slider')[index].style.display = 'block';
        document.getElementsByClassName('pilot-video slider')[index].style.right = '-350px'
        // endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
        console.log('Trying to move 3');
        pilotSlider();
    }
}



function pause(id) {
    var player = videojs(id);
    player.ima.pauseAd();
}

function play(id) {
    var player = videojs(id);
    player.ima.resumeAd();
}



var Player = function (id, vastTag, inArticle) {
    this.id = id;
    this.inArticle = inArticle;
    this.console = document.getElementById('ima-sample-console');
    this.playerz = videojs(id);
    this.init = function () {
        var player = videojs(this.id, {
            children: {
                controlBar: {
                    children: {
                        volumeControl: false
                    }
                }
            }
        });

        var options = {
            id: id,
            adTagUrl: vastTag,
            adsManagerLoadedCallback: this.adsManagerLoadedCallback.bind(this),
            preload: 'auto'
            // showControlsForJSAds: false
        };
        player.ima(options);

        // Remove controls from the player on iPad to stop native controls from stealing
        // our click
        var contentPlayer = document.getElementById(id);
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
        player.on('adserror', function () {
            console.log('Error Occured', id);
            // document.getElementById(id).style.visibility = 'hidden';
            // let x = document.getElementById(id).parentElement.nodeName;
            // document.getElementById("demo").innerHTML = x;
            document.getElementById(id).parentNode.style.display = 'none';
        });

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
    let endingPlay = document.getElementById(this.id);
    if (event.type == 'loaded') {
        if (endingPlay.hasAttribute("muted")) {
            videojs(this.id).ima.getAdsManager().setVolume(0);
        }
    }
    console.log("EVENT", event.type);
    if (event.type == 'start') {
        pause(this.id);

        console.log('PAUSED');
        if (this.inArticle == 'in_article') {
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.height = '0px';
        }

    }
    if (event.type == 'pause') {
        checkScroll();
    }
    if (event.type == 'allAdsCompleted') {


        if (this.inArticle == 'in_article') {
            endingPlay.style.display = 'none';
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.display = 'none';
            document.getElementsByClassName('pilot-video')[0].style.display = 'none';
        }

        else {
            endingPlay.style.visibility = 'hidden';
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
            document.getElementsByClassName('pilot-video')[0].style.visibility = 'hidden';
        }
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
    let inArticle = '';
    if (document.getElementsByClassName('pilot-video')[index].classList.contains('in_article') || document.getElementsByClassName('pilot-video')[index].classList.contains('in_article_fixed')) {
        inArticle = 'in_article'
    }
    console.log('CHECKER', inArticle);
    console.log(id);
    console.log(vastTag);
    console.log('=============================');
    var player1 = new Player(id, vastTag, inArticle);
    player1.init();
}
var videos = document.getElementsByClassName("pilot-player");
var fraction = 0.6;
let count = []

function checkScroll() {
    // console.log('ID =', videos[0].getAttribute('id'));
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
                if (!(document.getElementsByClassName('pilot-player')[i].classList.contains('pilot-checker')) && !(playVideo.classList.contains('stuck')) && playId) {
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
                document.getElementsByClassName('pilot-player')[i].classList.add("pilot-checker");
                if (document.getElementsByClassName('pilot-video')[i].classList.contains('stuck')) {
                    document.getElementsByClassName('in_article')[i].classList.remove("stuck");
                    document.getElementsByClassName('in_article')[i].style.height = realHeight[i] + "px";

                }

            } else {

                if ((document.getElementById(playId).classList.contains('pilot-checker')) && (document.getElementsByClassName('pilot-video')[i].classList.contains('in_article'))) {
                    document.getElementsByClassName('in_article')[i].classList.add("stuck");
                    document.getElementsByClassName('pilot-player')[i].classList.remove("pilot-checker");

                }

            }

        }
    }
}
window.addEventListener('scroll', checkScroll, false);