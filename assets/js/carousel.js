class Carousel {
    constructor(params) {
        let settings = this._initConfig(params);

        this.container = document.querySelector(settings.containerID);
        this.slides = this.container.querySelectorAll(settings.slideID);
        this.interval = settings.interval;
    }

    _initConfig(objectSettings) {
        let defaultSettings = { containerID: '#carousel', interval: 5000, slideID: '.slide' };
        return ({...defaultSettings, ...objectSettings });
    }

    _initProps() {
        this.slidesCount = this.slides.length;
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = 'Space';

        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';

        this.currentSliede = 0;
        this.timerID = null;
        this.isPlaying = true;
    }

    _initControls() {
        const controls = document.createElement('div');

        const PAUSE = `<span class="control control-pause" id="pause-btn">${this.FA_PAUSE}</span>`;
        const PREV = `<span class="control control-prev" id="prev-btn">${this.FA_PREV}</span>`;
        const NEXT = `<span class="control control-next" id="next-btn">${this.FA_NEXT}</span>`;

        controls.setAttribute('id', 'controls-container');
        controls.setAttribute('class', 'controls');
        controls.innerHTML = PREV + PAUSE + NEXT;

        this.container.appendChild(controls);

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    }

    _initIndicators() {
        const indicators = document.createElement('ol');

        indicators.setAttribute('id', 'indicators-container');
        indicators.setAttribute('class', 'indicators');

        for (let i = 0, n = this.slidesCount; i < n; i++) {
            const indicator = document.createElement('li');

            indicator.setAttribute('class', 'indicator');
            indicator.setAttribute('data-slide-to', `${i}`);
            i === 0 && indicator.classList.add('active');

            indicators.appendChild(indicator);
        };

        this.container.appendChild(indicators);

        this.indicatorsContainer = this.container.querySelector('#indicators-container');
        this.indicators = this.container.querySelectorAll('.indicator');
    }

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    }

    _goToSlide(n) {
        this.slides[this.currentSliede].classList.toggle('active');
        this.indicators[this.currentSliede].classList.toggle('active');
        this.currentSliede = (n + this.slidesCount) % this.slidesCount;
        this.slides[this.currentSliede].classList.toggle('active');
        this.indicators[this.currentSliede].classList.toggle('active');
    }

    _goToPrev() {
        this._goToSlide(this.currentSliede - 1)
    }

    _goToNext() {
        this._goToSlide(this.currentSliede + 1)
    }

    prev() {
        this.pause()
        this._goToPrev()
    }

    next() {
        this.pause()
        this._goToNext()
    }

    pause() {
        clearInterval(this.timerID);
        this.pauseBtn.innerHTML = this.FA_PLAY;
        this.isPlaying = false;
    }

    play() {
        this.timerID = setInterval(() => this._goToNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
    }

    pausePlay() {
        if (this.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    indicate(e) {
        const target = e.target;

        if (target && target.classList.contains('indicator')) {
            this.pause();
            this._goToSlide(+target.getAttribute("data-slide-to"));
        }
    }

    pressKey(e) {
        if (e.code === this.LEFT_ARROW) this.prev();
        if (e.code === this.RIGHT_ARROW) this.next();
        if (e.code === this.SPACE) this.pausePlay();
    }

    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();

        this.timerID = setInterval(() => this._goToNext(), this.interval);
    }

}

class SwipeCarousel extends Carousel {
    _initListeners() {
        super._initListeners();
        this.container.addEventListener('touchstart', this._swipeStart.bind(this));
        this.container.addEventListener('touchend', this._swipeEnd.bind(this));
    }

    _swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    }

    _swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        if (this.swipeStartX - this.swipeEndX > 100) this.next();
        if (this.swipeStartX - this.swipeEndX < -100) this.prev();
    }
}