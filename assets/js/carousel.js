function Carousel(containerID = '#carousel', slideID = '.slide') {
    this.container = document.querySelector(containerID);
    this.slides = this.container.querySelectorAll(slideID);
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.container.querySelectorAll('.indicator');

    this.interval = 2000;

    this._initProps();
    this._initControls();
    this._initListeners();
};

Carousel.prototype = {
    _initProps() {
        this.slidesCount = this.slides.length;
        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = 'Space';

        this.FA_PLAY = '<i class="far fa-pause-circle"></i>';
        this.FA_PAUSE = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';

        this.interval = 2000;
        this.currentSliede = 0;
        this.timerID = null;
        this.isPlaying = true;
    },


    _initControls() {
        const controls = document.createElement('div');

        const PAUSE = `<span class="control" id="pause-btn">${this.FA_PAUSE}</span>`;
        const PREV = `<span class="control" id="prev-btn">${this.FA_PREV}</span>`;
        const NEXT = `<span class="control" id="next-btn">${this.FA_NEXT}</span>`;

        controls.setAttribute('id', 'controls-container');
        controls.setAttribute('class', 'controls');
        controls.innerHTML = PAUSE + PREV + NEXT;

        this.container.appendChild(controls);

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
    },

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    },

    _goToSlide(n) {
        this.slides[this.currentSliede].classList.toggle('active');
        this.indicators[this.currentSliede].classList.toggle('active');
        this.currentSliede = (n + this.slidesCount) % this.slidesCount;
        this.slides[this.currentSliede].classList.toggle('active');
        this.indicators[this.currentSliede].classList.toggle('active');
    },

    _goToPrev() {
        this._goToSlide(this.currentSliede - 1)
    },

    _goToNext() {
        this._goToSlide(this.currentSliede + 1)
    },

    prev() {
        this.pause()
        this._goToPrev()
    },

    next() {
        this.pause()
        this._goToNext()
    },

    pause() {
        clearInterval(this.timerID);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = false;
    },

    play() {
        this.timerID = setInterval(() => this._goToNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PLAY;
        this.isPlaying = true;
    },

    pausePlay() {
        if (this.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    },

    indicate(e) {
        const target = e.target;

        if (target && target.classList.contains('indicator')) {
            this.pause();
            this._goToSlide(+target.getAttribute("data-slide-to"));
        }
    },

    pressKey(e) {
        if (e.code === this.LEFT_ARROW) this.prev();
        if (e.code === this.RIGHT_ARROW) this.next();
        if (e.code === this.SPACE) this.pausePlay();
    },

    init() {
        this.timerID = setInterval(() => this._goToNext(), this.interval);
    }
};

function SwipeCarousel() {
    Carousel.apply(this, arguments)
};

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.carousel = SwipeCarousel;

SwipeCarousel.prototype._initListeners = function () {
    Carousel.prototype._initListeners.apply(this);
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
};

SwipeCarousel.prototype._swipeStart = function (e) {
    this.swipeStartX = e.changedTouches[0].pageX;
    // console.log(e);
};

SwipeCarousel.prototype._swipeEnd = function (e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    if (this.swipeStartX - this.swipeEndX > 100) this.next();
    if (this.swipeStartX - this.swipeEndX < -100) this.prev();
};