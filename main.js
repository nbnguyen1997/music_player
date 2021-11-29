const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MY_PLAYER'

const player = $('.player')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');

const playBtn = $('.btn-toggle-play')

const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    randomQueueSongs: [],
    configs: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},


    setConfig: function (key, value) {
        this.configs[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.configs));
    },

    songs: [
        {
            name: 'An Giang Quê Tôi',
            singer: 'Hoàng Oanh',
            // path: '../assets/music/An Giang Que Toi.flac',
            path: '../assets/music/An_Giang_Que_Toi.flac',
            image: '../assets/img/song1.png'
        },
        {
            name: 'Ai Lên Xứ Hoa Đào',
            singer: 'Hoàng Oanh',
            path: '../assets/music/Ai Len Xu Hoa Dao.flac',
            image: '../assets/img/song2.png'
        },
        {
            name: 'Ánh Nắng Của Anh',
            singer: 'Đức Phúc',
            path: '../assets/music/Anh Nang Cua Anh - Duc Phuc.flac',
            image: '../assets/img/ANCA.jpg'
        },
        {
            name: 'Để Cho Em Khóc',
            singer: 'Minh Tuyết',
            path: '../assets/music/De Cho Em Khoc - Minh Tuyet.flac',
            image: '../assets/img/DCEK.jpg'
        },
        {
            name: 'Em Không Sai Chúng Ta Sai',
            singer: 'Erik',
            path: '../assets/music/Em Khong Sai Chung Ta Sai - Erik.flac',
            image: '../assets/img/EKSCTS.jpg'
        },
        {
            name: 'Không Thể Cùng Nhau Suốt Kiếp',
            singer: 'Hòa Minzy',
            path: '../assets/music/Khong The Cung Nhau Suot Kiep - Hoa Minz.flac',
            image: '../assets/img/KTCNSK.jpg'
        },
        {
            name: 'LK Đã Không Yêu Thì Thôi',
            singer: 'Minh Tuyết',
            path: '../assets/music/Lien Khuc Da Khong Yeu Thi Thoi Da Khong.flac',
            image: '../assets/img/DKYTT.jpg'
        },
        {
            name: 'Một Thời Đã Xa',
            singer: 'Minh Tuyết, Johnny Dung',
            path: '../assets/music/Mot Thoi Da Xa - Minh Tuyet_ Johnny Dung.flac',
            image: '../assets/img/MTDX.jpg'
        },
        {
            name: 'Người Ơi Người Ở Đừng Về',
            singer: 'Đức Phúc',
            path: '../assets/music/Nguoi Oi Nguoi O Dung Ve - Duc Phuc_ Sub.flac',
            image: '../assets/img/NONODV.jpg'
        },
        {
            name: 'Rời Bỏ',
            singer: 'Hòa Minzy',
            path: '../assets/music/Roi Bo - Hoa Minzy.flac',
            image: '../assets/img/RB.jpg'
        },
        {
            name: 'Trả Người Về Tự Do',
            singer: 'Minh Tuyết, Tăng Phúc',
            path: '../assets/music/Tra Nguoi Ve Tu Do Live Version_ - Tang.flac',
            image: '../assets/img/TNVTD.jpg'
        },
        {
            name: 'Trên Tình Bạn Dưới Tình Yêu',
            singer: 'MIN',
            path: '../assets/music/TREN TINH BAN DUOI TINH YEU PAY x Mer li.flac',
            image: '../assets/img/TTBDTY.jpg'
        },

    ],

    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `<div class="song ${index == app.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}');">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        })

        $('.playlist').innerHTML = htmls.join('');
        console.log('Render')
        console.log('Current index:' + this.currentIndex)
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function () {

        const _this = this // this ở đây là cái app, _this này được gán với app

        //Xu ly CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Xu ly phong to thu nho CD 
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xu ly nut playlist
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();

            } else {
                audio.play();
            }

        }

        //Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
            _this.setConfig('currentIndex', _this.currentIndex);
        }

        //Khi song bi paused
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }

        }
        //Xu ly khi tua Songs
        progress.onchange = function (e) {

            audio.currentTime = (audio.duration * e.target.value) / 100;
        }

        //Khi next Song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }

            audio.play();
        }

        //Khi prev Song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }

            audio.play();
        }

        //Xu ly bat tat random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom); // toggle nhan boolean o paras thu 2
            _this.render();

        }

        //Xu ly next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //Xu ly phat lai bai hat 
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }

        //Lang nghe hanh vi click vao 1 bai hat
        $('.playlist').onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xu ly khi click vao Song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }


            }
        }


    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRandom = this.configs.isRandom;
        this.isRepeat = this.configs.isRepeat;
        this.currentIndex = this.configs.currentIndex;
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToAtivedSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToAtivedSong();
    },

    playRandomSong: function () {

        if (this.randomQueueSongs.length == 0) {
            this.songs.map((item, index) => {
                this.randomQueueSongs.push(index);
            })
            this.randomQueueSongs.splice(this.currentIndex, 1);
        }
        var removedIndex = Math.floor(Math.random() * this.randomQueueSongs.length);
        var removedItem = this.randomQueueSongs.splice(removedIndex, 1);
        this.currentIndex = removedItem;
        console.log("index bị  remove:" + removedIndex + "Item bị remove: " + removedItem);
        console.log(this.randomQueueSongs);
        this.loadCurrentSong();
        this.render();
    },



    scrollToAtivedSong: function () {
        setTimeout(() => {

            $('.song.active').scrollIntoView({ behavior: "smooth", block: "nearest" })


        }, 200)


    },

    start: function () {
        // Dinh nghia thuoc tinh cho object
        this.defineProperties();

        //Lang nghe/ xu ly su kien dom events
        this.handleEvents();

        //Load cau hinh tu configs vao object app
        this.loadConfig();




        //Tai bai hat dau tien vao UI
        this.loadCurrentSong();

        //Render PLAYLIST
        this.render();
    }

}

app.start();


