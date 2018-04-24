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
let playList =[];

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

    // let playBtn = document.createElement('div');
    // playBtn.innerHTML = '&#9658;'
    // playBtn.id = 'play-' + index;
    // // playBtn.setAttribute("data-player", id);
    // playBtn.classList.add('pilot-closeBtn');
    // playBtn.addEventListener("click", function (e) {
    //     play(id);
    // });

    // let pauseBtn = document.createElement('div');
    // pauseBtn.innerHTML = '&#10074;&#10074;'
    // pauseBtn.id = 'pause-' + index;
    // // playBtn.setAttribute("data-player", id);
    // pauseBtn.classList.add('pilot-closeBtn');
    // pauseBtn.addEventListener("click", function (e) {
    //     pause(id);
    // });

    let cont = document.createElement('span');
    cont.appendChild(closeBtn);
    // cont.appendChild(playBtn);
    // cont.appendChild(pauseBtn);



    // addclose[index].appendChild(closeBtn);
    addclose[index].insertBefore(cont, addclose[index].firstChild)

}


function pilotSlider(id) {
    let stopPosition = 20;
    if (parseInt(document.getElementById(id).parentNode.style.right) < stopPosition) {
        document.getElementById(id).parentNode.style.right = parseInt(document.getElementById(id).parentNode.style.right) + 10 + "px";
        setTimeout(() => {
            pilotSlider(id)
        }, 0.5);

    }
    console.log('CONTAIN SLIDER==2')
}

// SLIDING VIDEOconta

if (document.getElementsByClassName('slider')) {
    let slidingTotal = document.getElementsByClassName('pilot-video slider');
    for (let index = 0; index < slidingTotal.length; index++) {
        document.getElementsByClassName('pilot-video slider')[index].style.display = 'block';
        document.getElementsByClassName('pilot-video slider')[index].style.right = '-650px'
        // endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
        console.log('Trying to move 3');
        // pilotSlider();
    }
}


function fadeIn(ele) {
    console.log('OPACITY VALUE=', ele.style.opacity);
    if (parseFloat(ele.style.opacity) < 1) {
        ele.style.opacity = parseFloat(ele.style.opacity) + 0.005;
        setTimeout(() => {
            console.log('inside opacity');
            fadeIn(ele)
        }, 0.5);
    }

};

function fadeOut(ele) {
    console.log('OPACITY VALUE=', ele.style.opacity);
    if (parseFloat(ele.style.opacity) >= 0) {
        ele.style.opacity = parseFloat(ele.style.opacity) - 0.05;
        setTimeout(() => {
            console.log('inside opacity');
            fadeOut(ele)
        }, 0.5);
    }

};

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
            preload: 'auto',
            adLabel:'Time Remaining'
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
            console.log('Error Occured at', id);
            // document.getElementById(id).style.visibility = 'hidden';
            // let x = document.getElementById(id).parentElement.nodeName;
            // document.getElementById("demo").innerHTML = x;
            document.getElementById(id).parentNode.style.display = 'none';
        });

        player.one(startEvent, function () {
            player.ima.initializeAdDisplayContainer();
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

    let logoDiv = document.createElement('div');
    logoDiv.classList.add("logostyle");
    let logoImg = document.createElement('img');
    logoImg.src = 'img/CoPilot.png'
    logoDiv.appendChild(logoImg);
    // logoDiv.style.right = '4px';
    // logoDiv.classList.add("logostyle");
    let controlDiv = this.id + '_ima-controls-div';

    document.getElementById(controlDiv).appendChild(logoDiv);
    if (event.type == 'loaded') {

        if (endingPlay.hasAttribute("muted")) {
            videojs(this.id).ima.getAdsManager().setVolume(0);
        }
    

    }
    console.log("EVENT", event.type);
    if (event.type == 'start'){
        if (!endingPlay.parentNode.classList.contains('slider')) {
        endingPlay.parentNode.style.visibility = 'visible';
        endingPlay.parentNode.style.opacity = 0;
        endingPlay.style.visibility = 'visible';
        pause(this.id);
        playList.push(this.id);
        fadeIn(endingPlay.parentNode);
        console.log('PAUSED');
        if (this.inArticle.indexOf('article') >= 0) {
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.height = '0px';
        }
    }
        if (endingPlay.parentNode.classList.contains('slider')) {
            endingPlay.parentNode.style.visibility = 'visible';
            endingPlay.style.visibility = 'visible';
            // endingPlay .parentNode.classList.add('slider2'); 
            console.log('CONTAIN SLIDER==1')
            console.log('protopype=', this.id)
            pilotSlider(this.id);
        }
    }
    if (event.type == 'pause') {
        checkScroll();
    }
    // if (event.type=='complete') {
    //     fadeOut(endingPlay.parentNode);
    //     console.log("doing fadeout")
    // }
    if (event.type == 'complete') {
        // if (this.inArticle == 'in_article')
        if (this.inArticle.indexOf('article') >= 0)
         {
            endingPlay.style.display = 'none';
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.display = 'none';
            endingPlay.parentNode.style.display = 'none';
        }
        else {
            endingPlay.style.visibility = 'hidden';
            fadeOut(endingPlay.parentNode);
            endingPlay.getElementsByClassName('vjs-control-bar')[0].style.visibility = 'hidden';
            endingPlay.parentNode.style.visibility = 'hidden';
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
    if (videos[0].getAttribute('data-view') !== "mobile_web" && document.getElementsByClassName("pilot-player")[0]) {
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
                let indexOfPlayer = playList.indexOf(playId);
                if (!(document.getElementById(playId).parentNode.classList.contains('pilot-checker')) && !(playVideo.classList.contains('stuck')) && playId && indexOfPlayer > -1) {
                    play(playId);
                    playList.splice(indexOfPlayer, 1);
                    console.log('PLAY');
                }
                if ((!document.getElementById(playId).classList.contains('pilot-checker')) && (document.getElementById(playId).parentNode.classList.contains ('stuck'))) {
                    document.getElementById(playId).parentNode.classList.remove('stuck')
                }
                playVideo.style.height = realHeight[i]+ "px";
                playVideo.style.width = realWidth[i] + "px";
                document.getElementById(playId).classList.add("pilot-checker");
                if (document.getElementsByClassName('pilot-video')[i].classList.contains('stuck')) {
                    document.getElementById(playId).parentNode.classList.remove("stuck");
                    document.getElementsByClassName('in_article')[i].style.height = realHeight[i] + "px";
                }

            } else {
                playList.push(playId);
                if ((document.getElementById(playId).classList.contains('pilot-checker')) && (document.getElementById(playId).parentNode.classList.contains('in_article'))) {
                    document.getElementById(playId).parentNode.classList.add("stuck");
                    document.getElementById(playId).parentNode.classList.remove("pilot-checker");
                }
                if (document.getElementById(playId).classList.contains('in_article_fixed') || document.getElementById(playId).classList.contains('standard')) {
                    document.getElementById(playId).classList.remove("pilot-checker");
                    pause(playId);
                }

            }

        }
    }
}
window.addEventListener('scroll', checkScroll, false);