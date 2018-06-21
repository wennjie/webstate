'use strict';

Vue.component('agile', {
    template: ' <div class="agile"\n    :class="{\'agile--fade\': settings.fade && !settings.unagile, \'agile--disabled\': settings.unagile}">\n   <div ref="list" class="agile__list">\n       <div ref="track" class="agile__track"\n            :style="{width: width.track + \'px\', transform: \'translate(-\' + transform + \'px)\', transition: \'transform \' + settings.timing + \' \' + transitionDelay + \'ms\'}"\n            @mouseover="handleMouseOver(\'track\')" @mouseout="handleMouseOut(\'track\')">\n           <slot></slot>\n       </div>\n   </div>\n   <ul ref="dots" v-if="settings.dots && !settings.unagile" class="agile__dots">\n       <li v-for="n in slidesCount" class="agile__dot"\n           :class="{\'agile__dot--current\': n - 1 === currentSlide}"\n           @mouseover="handleMouseOver(\'dot\')" @mouseout="handleMouseOut(\'dot\')">\n\n           <button @click="setSlide(n - 1)" type="button">{{n}}</button>\n       </li>\n   </ul>\n   <button v-if="settings.arrows && !settings.unagile" class="agile__arrow agile__arrow--prev"\n           :disabled="currentSlide === 0 && !settings.infinite" @click="prevSlide" v-html="settings.prevArrow">\n   </button>\n   <button v-if="settings.arrows && !settings.unagile" class="agile__arrow agile__arrow--next"\n           :disabled="currentSlide === slidesCount - 1 && !settings.infinite" @click="nextSlide"\n           v-html="settings.nextArrow">\n   </button>\n</div>',
    name: 'agile',

    props: {
        arrows: {
            type: Boolean,
            default: true
        },

        autoplay: {
            type: Boolean,
            default: false
        },

        autoplaySpeed: {
            type: Number,
            default: 3000
        },

        dots: {
            type: Boolean,
            default: true
        },

        fade: {
            type: Boolean,
            default: false
        },

        infinite: {
            type: Boolean,
            default: true
        },

        mobileFirst: {
            type: Boolean,
            default: true
        },

        nextArrow: {
            type: String,
            default: '<svg x="0px" y="0px" viewBox="0 0 24 24"><path d="M7.8,21c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l7.4-7.3L7,4.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l8.8,8.7l-8.8,8.7C8.3,20.9,8,21,7.8,21z"/></svg>'
        },

        options: {
            type: Object,
            default: function _default() {
                return null;
            }
        },

        pauseOnDotsHover: {
            type: Boolean,
            default: false
        },

        pauseOnHover: {
            type: Boolean,
            default: true
        },

        prevArrow: {
            type: String,
            default: '<svg x="0px" y="0px" viewBox="0 0 24 24"><path d="M16.2,21c0.3,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L9.6,12L17,4.7c0.4-0.4,0.4-1,0-1.4c-0.4-0.4-1-0.4-1.4,0L6.8,12l8.8,8.7C15.7,20.9,16,21,16.2,21z"/></svg>'
        },

        responsive: {
            type: Object,
            default: function _default() {
                return null;
            }
        },

        show: {
            type: Boolean,
            default: true
        },

        speed: {
            type: Number,
            default: 300
        },

        timing: {
            type: String,
            default: 'ease' // linear, ease-in, ease-out, ease-in-out
        },

        unagile: {
            type: Boolean,
            default: false
        }
    },

    data: function data() {
        return {
            slides: null,
            slidesCount: 0,
            autoplayStatus: false,
            autoplayTimeout: null,
            allSlidesCount: 0,
            currentSlide: 0,
            mouseDown: false,
            dragStartX: 0,
            dragStaryY: 0,
            dragDistance: 0,
            swipeDistance: 50,
            transform: 0,
            transitionDelay: 0,
            width: {
                document: 0,
                container: 0,
                slide: 0,
                track: 0
            },
            slidesToShow: 1,
            defaultSettings: {
                prevArrow: this.prevArrow,
                nextArrow: this.nextArrow,
                arrows: this.arrows,
                autoplay: this.autoplay,
                autoplaySpeed: this.autoplaySpeed,
                dots: this.dots,
                fade: this.fade,
                infinite: this.infinite,
                mobileFirst: this.mobileFirst,
                pauseOnDotsHover: this.pauseOnDotsHover,
                pauseOnHover: this.pauseOnHover,
                responsive: this.responsive,
                speed: this.speed,
                timing: this.timing,
                unagile: this.unagile
            },
            settings: {}
        };
    },
    created: function created() {
        // Read settings from options object
        if (this.options) {
            for (var key in this.options) {
                this.defaultSettings[key] = this.options[key];
            }
        }

        // Sort breakpoints
        if (this.defaultSettings.responsive) {
            this.defaultSettings.responsive.sort(this.compare);
        }

        // Set first load settings
        Object.assign(this.settings, this.defaultSettings);
    },
    mounted: function mounted() {
        // Prepare slides
        this.slides = this.$refs.track.children;
        this.slidesCount = this.slides.length;

        for (var i = 0; i < this.slidesCount; ++i) {
            this.slides[i].classList.add('agile__slide');

            // Prepare slides for fade mode
            if (this.settings.fade) {
                this.slides[i].style.transition = 'opacity ' + this.timing + ' ' + this.speed + 'ms';
            }
        }

        // Windows resize listener
        window.addEventListener('resize', this.getWidth);

        // Mouse and touch events
        if ('ontouchstart' in window) {
            this.$refs.track.addEventListener('touchstart', this.handleMouseDown);
            this.$refs.track.addEventListener('touchend', this.handleMouseUp);
            this.$refs.track.addEventListener('touchmove', this.handleMouseMove);
        } else {
            this.$refs.track.addEventListener('mousedown', this.handleMouseDown);
            this.$refs.track.addEventListener('mouseup', this.handleMouseUp);
            this.$refs.track.addEventListener('mousemove', this.handleMouseMove);
        }

        // Get width on start
        this.getWidth();
    },
    beforeDestroy: function beforeDestroy() {
        window.removeEventListener('resize', this.getWidth);

        if ('ontouchstart' in window) {
            this.$refs.track.removeEventListener('touchstart', this.handleMouseDown);
            this.$refs.track.removeEventListener('touchend', this.handleMouseUp);
            this.$refs.track.removeEventListener('touchmove', this.handleMouseMove);
        } else {
            this.$refs.track.removeEventListener('mousedown', this.handleMouseDown);
            this.$refs.track.removeEventListener('mouseup', this.handleMouseUp);
            this.$refs.track.removeEventListener('mousemove', this.handleMouseMove);
        }

        this.disableAutoplayMode();
    },


    methods: {
        getWidth: function getWidth() {
            this.width = {
                document: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                container: this.$refs.list.clientWidth,
                slide: !this.settings.unagile ? this.$refs.list.clientWidth / this.slidesToShow : 'auto'
            };
        },
        compare: function compare(a, b) {
            if (a.breakpoint < b.breakpoint) {
                return this.defaultSettings.mobileFirst ? -1 : 1;
            } else if (a.breakpoint > b.breakpoint) {
                return this.defaultSettings.mobileFirst ? 1 : -1;
            } else {
                return 0;
            }
        },
        handleMouseDown: function handleMouseDown(e) {
            if (!e.touches) {
                e.preventDefault();
            }

            this.mouseDown = true;
            this.dragStartX = 'ontouchstart' in window ? e.touches[0].clientX : e.clientX;
            this.dragStartY = 'ontouchstart' in window ? e.touches[0].clientY : e.clientY;
        },
        handleMouseMove: function handleMouseMove(e) {
            var positionX = 'ontouchstart' in window ? e.touches[0].clientX : e.clientX;
            var positionY = 'ontouchstart' in window ? e.touches[0].clientY : e.clientY;

            var dragDistanceX = Math.abs(positionX - this.dragStartX);
            var dragDistanceY = Math.abs(positionY - this.dragStartY);

            if (dragDistanceX > 3 * dragDistanceY) {
                this.dragDistance = positionX - this.dragStartX;
                this.disableScroll();
            }
        },
        handleMouseUp: function handleMouseUp() {
            this.mouseDown = false;
            this.enableScroll();
        },
        handleMouseOver: function handleMouseOver(element) {
            if (this.settings.autoplay) {
                if (element === 'dot' && this.settings.pauseOnDotsHover || element === 'track' && this.settings.pauseOnHover) {
                    this.disableAutoplayMode();
                }
            }
        },
        handleMouseOut: function handleMouseOut(element) {
            if (this.settings.autoplay) {
                if (element === 'dot' && this.settings.pauseOnDotsHover || element === 'track' && this.settings.pauseOnHover) {
                    this.enableAutoplayMode();
                }
            }
        },
        enableInfiniteMode: function enableInfiniteMode() {
            if (!this.settings.fade && !this.$refs.list.getElementsByClassName('agile__slide--cloned')[0]) {
                var firstSlide = this.$refs.track.firstChild.cloneNode(true);
                var lastSlide = this.$refs.track.lastChild.cloneNode(true);

                firstSlide.classList.add('agile__slide--cloned');
                lastSlide.classList.add('agile__slide--cloned');

                this.$refs.track.insertBefore(lastSlide, this.slides[0]);
                this.$refs.track.insertBefore(firstSlide, this.slides[this.slidesCount].nextSibling);
            }

            this.countSlides();
        },
        disableInfiniteMode: function disableInfiniteMode() {
            var clonedSlides = this.$refs.list.getElementsByClassName('agile__slide--cloned');

            while (clonedSlides[0]) {
                clonedSlides[0].parentNode.removeChild(clonedSlides[0]);
            }

            this.countSlides();
        },
        enableAutoplayMode: function enableAutoplayMode() {
            // Protection against contradictory settings
            if (!this.settings.infinite) {
                this.settings.infinite = true;
                this.enableInfiniteMode();
            }

            this.stopAutoplay();
            this.startAutoplay();
            this.autoplayStatus = true;
        },
        disableAutoplayMode: function disableAutoplayMode() {
            this.autoplayStatus = false;
            this.stopAutoplay();
        },
        countSlides: function countSlides() {
            if (this.settings.infinite && !this.settings.fade && !this.settings.unagile) {
                this.allSlidesCount = this.slidesCount + 2;
            } else {
                this.allSlidesCount = this.slidesCount;
            }
        },
        disableScroll: function disableScroll() {
            document.ontouchmove = function (e) {
                e.preventDefault();
            };
        },
        enableScroll: function enableScroll() {
            document.ontouchmove = function (e) {
                return true;
            };
        },
        addActiveClass: function addActiveClass(i) {
            this.slides[i].classList.add('agile__slide--active');
        },
        startAutoplay: function startAutoplay() {
            var _this = this;

            this.autoplayTimeout = setTimeout(function () {
                if (!_this.settings.autoplay) {
                    _this.stopAutoplay();
                    _this.disableAutoplayMode();
                    return false;
                }

                _this.nextSlide();
            }, this.autoplaySpeed);
        },
        stopAutoplay: function stopAutoplay() {
            clearTimeout(this.autoplayTimeout);
        },
        setSlide: function setSlide(n) {
            var _this2 = this;

            var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var autoplayTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            if (this.settings.unagile) {
                return false;
            }

            // Reset autoplay timeout and set new
            if (this.settings.autoplay && autoplayTimeout) {
                this.stopAutoplay();
                this.startAutoplay();
            }

            if (this.settings.fade) {
                // Disable transition for initial slide
                if (transition === false) {
                    this.slides[n].style.transition = '0ms';

                    setTimeout(function () {
                        _this2.slides[n].style.transition = 'opacity ' + _this2.timing + ' ' + _this2.speed + 'ms';
                    }, 10);
                }

                for (var i = 0; i < this.allSlidesCount; ++i) {
                    this.slides[i].classList.remove('agile__slide--expiring');
                }

                if (this.settings.infinite && n < 0) {
                    n = this.slidesCount - 1;
                } else if (n >= this.slidesCount) {
                    n = 0;
                }

                // Set current slide as expiring
                var e = this.currentSlide;
                this.slides[e].classList.add('agile__slide--expiring');

                setTimeout(function () {
                    _this2.slides[e].classList.remove('agile__slide--expiring');
                }, this.settings.speed);

                this.transform = 0;
            } else {
                this.transform = n * this.width.slide;
            }

            for (var _i = 0; _i < this.allSlidesCount; ++_i) {
                this.slides[_i].classList.remove('agile__slide--active');
            }

            if (this.settings.infinite && !this.settings.fade) {
                this.transform += this.width.slide;
                this.addActiveClass(n + 1);
            } else {
                this.addActiveClass(n);
            }

            if (!transition) {
                this.transitionDelay = 0;
            } else {
                this.transitionDelay = this.speed;
            }

            if (this.settings.infinite && n < 0) {
                this.currentSlide = this.slidesCount - 1;

                setTimeout(function () {
                    _this2.setSlide(_this2.slidesCount - 1, false);
                }, this.speed);
            } else if (this.settings.infinite && n >= this.slidesCount) {
                this.currentSlide = 0;

                setTimeout(function () {
                    _this2.setSlide(0, false);
                }, this.settings.speed);
            } else {
                this.currentSlide = n;
            }
        },
        nextSlide: function nextSlide() {
            this.setSlide(this.currentSlide + 1);
        },
        prevSlide: function prevSlide() {
            this.setSlide(this.currentSlide - 1);
        },
        reload: function reload() {
            var _this3 = this;

            // Responsive
            if (this.defaultSettings.responsive) {
                var responsiveSettings = {};
                Object.assign(responsiveSettings, this.defaultSettings);

                responsiveSettings.responsive.forEach(function (responsive) {
                    if (_this3.defaultSettings.mobileFirst) {
                        if (responsive.breakpoint < _this3.width.document) {
                            for (var key in responsive.settings) {
                                responsiveSettings[key] = responsive.settings[key];
                            }
                        }
                    } else {
                        if (responsive.breakpoint > _this3.width.document) {
                            for (var _key in responsive.settings) {
                                responsiveSettings[_key] = responsive.settings[_key];
                            }
                        }
                    }
                });

                Object.assign(this.settings, responsiveSettings);
            }

            // Check infinity mode status and enable/disable
            if (this.settings.infinite && !this.settings.fade && !this.settings.unagile) {
                this.enableInfiniteMode();
            } else {
                this.disableInfiniteMode();
            }

            // Check autoplay mode status and enable/disable
            if (this.settings.autoplay && !this.autoplayStatus) {
                this.enableAutoplayMode();
            }

            if (!this.settings.autoplay && this.autoplayStatus || this.settings.unagile) {
                this.disableAutoplayMode();
            }

            // Actions on document resize
            for (var i = 0; i < this.allSlidesCount; ++i) {
                this.slides[i].style.width = this.width.container + 'px';

                // Prepare slides for fade mode
                if (this.settings.fade && !this.settings.unagile) {
                    this.slides[i].style.transform = 'translate(-' + i * this.width.slide + 'px)';
                } else {
                    this.slides[i].style.transform = 'translate(0)';
                }
            }

            // Prepare track
            if (this.settings.unagile) {
                this.width.track = this.width.container;
                this.transform = 0;
            } else {
                this.width.track = this.width.container * this.allSlidesCount;
                this.setSlide(this.currentSlide, false, false);
            }
        }
    },

    computed: {
        documentWidth: function documentWidth() {
            return this.width.document;
        }
    },

    watch: {
        show: function show() {
            this.getWidth();
            this.reload();
        },
        documentWidth: function documentWidth() {
            this.reload();
        },
        dragDistance: function dragDistance() {
            if (this.mouseDown) {
                if (this.dragDistance > this.swipeDistance) {
                    if (!this.settings.infinite && this.currentSlide === 0) {
                        return;
                    }

                    this.prevSlide();
                    this.handleMouseUp();
                }

                if (this.dragDistance < -1 * this.swipeDistance) {
                    if (!this.settings.infinite && this.currentSlide === this.slidesCount - 1) {
                        return;
                    }

                    this.nextSlide();
                    this.handleMouseUp();
                }
            }
        }
    }
});