var statobashi = (function () {
    'use strict';

    var defaultSettings = {
        bullets: [
            { image: 'https://mouneyou.rgx6.com/images/anime/anime004.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime005.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime007.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime012.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime016.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime022.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime027.png', pattern: 4 },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime029.png', pattern: 2 },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime030.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime036.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime037.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime042.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime043.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime044.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime048.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime051.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime053.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime060.png' },
            { image: 'https://mouneyou.rgx6.com/images/anime/anime062.png' },
            { image: 'http://statobashi.rgx6.com/image/casket_orange.png' },
            { image: 'http://statobashi.rgx6.com/image/casket_black.png' },
            { image: 'http://statobashi.rgx6.com/image/casket_white.png' },
            { image: 'http://statobashi.rgx6.com/image/casket_green.png' },
            { image: 'http://statobashi.rgx6.com/image/casket_blue.png' },
            { image: 'http://statobashi.rgx6.com/image/casket_pink.png' },
        ],
        canvasWrapperId: 'statobashi-canvas-wrapper',
        fps: 60,
        crossingTimeMax: 3000,
        crossingTimeMin: 100,
        scale: 0.5,
        z_index: 7144,
    };

    var settings = {};

    var animations = [];

    var isAnimating = false;

    var canvasWrapper = undefined;
    var canvas = undefined;
    var context = undefined;

    function init (options) {
        settings = Object.assign({}, defaultSettings, options);

        createCanvas();

        resizeCanvas();

        window.addEventListener('resize', function () {
            resizeCanvas();
        });

        // pointer-events: none; に対応していないブラウザ対策
        document.getElementById(settings.canvasWrapperId).addEventListener('click', function () {
            console.log(settings.canvasWrapperId + ' click');
            this.style.display = 'none';
        });
    }

    function createCanvas () {
        canvasWrapper = document.createElement('div');
        canvasWrapper.id = settings.canvasWrapperId;
        canvasWrapper.style.cssText = 'height:100%;left:0;margin:0;padding:0;pointer-events:none;position:fixed;top:0;width:100%;z-index:' + settings.z_index + ';';

        canvas = document.createElement('canvas');
        canvas.style.cssText = 'margin:0;padding:0;pointer-events:none;';

        canvasWrapper.appendChild(canvas);

        document.body.appendChild(canvasWrapper);

        context = canvas.getContext('2d');
    }

    function resizeCanvas () {
        canvas.setAttribute('width', canvasWrapper.offsetWidth);
        canvas.setAttribute('height', canvasWrapper.offsetHeight);
    }

    function getRandomBullet () {
        var index = Math.floor(Math.random() * settings.bullets.length);
        return settings.bullets[index];
    }

    function getRandomDuration () {
        var duration = Math.floor(Math.random() * (settings.crossingTimeMax - settings.crossingTimeMin)) + settings.crossingTimeMin;
        return duration;
    }

    function launch (bullet, duration) {
        bullet = bullet || getRandomBullet();
        duration = duration || getRandomDuration();
        startAnimation(bullet, settings.scale, duration);
    }

    function startAnimation (bullet, scale, duration) {
        var img = new Image();

        img.onload = function () {
            var pattern = bullet.pattern || 1;
            var width = this.width / pattern;
            var timeToDelete = duration;
            var frameToDelete = timeToDelete * settings.fps / 1000;
            var speedPerFrame = (canvasWrapper.offsetWidth + width * scale) / frameToDelete;

            var animation = {
                img: this,
                left: canvasWrapper.offsetWidth,
                top: Math.floor(Math.random() * canvasWrapper.offsetHeight - this.height * scale / 2),
                speed: speedPerFrame,
                scale: scale,
                width: width,
                height: this.height,
                pattern: pattern,
                drawOffsetLeft: 0,
                drawOffsetCount: 0,
                frameCount: 0,
                frameToChange: Math.floor(Math.random() * 10 + 1),
            };

            animations.push(animation);

            if (!isAnimating && window.requestAnimationFrame) {
                render();
            }
        };

        img.src = bullet.image;
    }

    function render () {
        isAnimating = true;

        context.clearRect(0, 0, canvas.width, canvas.height);

        animations.forEach(function (anime) {
            context.save();
            context.scale(anime.scale, anime.scale);
            if (anime.pattern == 1) {
                // scaleはサイズにだけ反映させたいので座標への影響をキャンセル
                context.drawImage(anime.img, anime.left / anime.scale, anime.top / anime.scale);
            } else {
                context.drawImage(
                    anime.img,
                    anime.drawOffsetLeft,
                    0,
                    anime.width,
                    anime.height,
                    anime.left / anime.scale,
                    anime.top / anime.scale,
                    anime.width,
                    anime.height);

                anime.frameCount = (anime.frameCount + 1) % anime.frameToChange;
                if (anime.frameCount == 0) {
                    anime.drawOffsetCount = (anime.drawOffsetCount + 1) % anime.pattern;
                    anime.drawOffsetLeft = anime.width * anime.drawOffsetCount;
                }
            }
            context.restore();

            anime.left -= anime.speed;
        });

        for (var i = animations.length - 1; 0 <= i; i--) {
            if (animations[i].left + animations[i].img.width < 0) animations.splice(i, 1);
        }

        if (0 < animations.length) {
            window.requestAnimationFrame(render);
        } else {
            isAnimating = false;
        }
    }

    return {
        init: init,
        launch: launch,
    };
}());
