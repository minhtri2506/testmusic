const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: 'Sài gòn đau lòng quá',
            singer: 'Hứa Kim Tuyền',
            path: './music/SaiGonDauLongQua.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/song/2021/03/27/d/2/9/1/1616859493571_500.jpg'
        },
        {
            name: 'Một bước yêu vạn dặm đau',
            singer: 'Mr Siro',
            path: './music/MotBuocYeuVanDamDau.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/singer/avatar/2017/09/11/2/9/c/6/1505103180911.jpg'
        },
        {
            name: '31073',
            singer: 'VA',
            path: './music/31073.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/singer/avatar/2019/12/10/e/8/9/7/1575970629322_600.jpg'
        },
        {
            name: 'Từng là tất cả',
            singer: 'Karik',
            path: './music/TungLaTatCa.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/06/29/0/9/e/a/1593412376912.jpg'
        },
        {
            name: 'Yêu em quá đi',
            singer: 'Karik',
            path: './music/YeuEmQuaDi.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/singer/cover/2020/06/29/6/5/3/8/1593412377122.jpg'
        },
        {
            name: 'Câu hẹn câu thề',
            singer: 'Đình Dũng, ACV',
            path: './music/CauHenCauThe.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/song/2021/03/29/2/2/1/e/1617029681297_500.jpg'
        },
        {
            name: 'Sài gòn sẽ ổn thôi',
            singer: 'SuZu Music',
            path: './music/SaiGonSeOnThoi.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/song/2021/08/27/9/0/e/c/1630063300547_500.jpg'
        },
        {
            name: 'Thương',
            singer: 'Karik, Uyên Pím',
            path: './music/Thuong.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/song/2017/12/19/1/e/0/d/1513679484858_500.jpg'
        },
        {
            name: 'Khi người yêu mình khóc',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/KhiNguoiMinhYeuKhoc.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/singer/avatar/2017/09/20/b/8/3/8/1505895112608.jpg'
        },
        {
            name: 'Vợ người ta',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/VoNguoiTa.mp3',
            image:'https://avatar-ex-swe.nixcdn.com/song/2018/03/11/6/7/d/9/1520771354788_500.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" 
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý cd quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10s
            iteration: Infinity // quay vô hạn
        })
        cdThumbAnimate.pause();

        // xử lý phóng to thu nhỏ cd
        document.onscroll = function(){
            const scropllTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scropllTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // xử lý khi click play
        playBtn.onclick= function(){
            if(_this.isPlaying){
                audio.pause()
            } else{
                audio.play()
            }
        }

        // khi bài hát play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi bài hát dừng
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
            }
        }

        // xử lý khi tua bài hát
        progress.oninput = function(e){
            const seekTime = audio.duration/100 * e.target.value;
            audio.currentTime = seekTime;
        }
        
        //Khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRamdomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToAcTiveSong()
        }

        //Khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRamdomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToAcTiveSong()
        }

        //xử lí random bật tắt
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //xử lý lặp lại một bài
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //xử lý next song khi bài hất kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        
        // lắng nghe click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')){
                //xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
         }
        }
    },
    scrollToAcTiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior :'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if ( this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if ( this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRamdomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex) {
            this.currentIndex = newIndex
            this.loadCurrentSong()
        }
    },
    start: function(){
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // định nghĩa các thuộc thính cho object
        this.defineProperties()

        // lắng nghe xử ký các sự kiên DOM events
        this.handleEvents()

        // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start();