/* author: webcorgi */

$(function(){
    // maxLengthCheck()
    // typingModelMessage()

    scrollProgressbar()
    activeRadio()
    activeParticles()
    keyController()
    cssResponseControllerSize()
    activePopup()
    changeCharacter()
    $(window).resize(cssResponseControllerSize)
})


function maxLengthCheck(object) {
    if (object.value.length > object.maxLength) {
        object.value = object
            .value
            .slice(0, object.maxLength);
    }
}



function scrollProgressbar(){
    $prgressbar = $('.js_prgressbar').eq(0)
    $progress = $('.js_progress').eq(0)
    let leng = $('.js_main_section').children().length-1
    $('.js_main_section').on('scroll', function(e) {
        let mainH = parseInt((e.target.clientHeight+(leng*3))*leng)
        let scTop = $(this).scrollTop()
        $progress.css({width:`${(scTop/mainH)*100}%`})
    })
}

function cssResponseControllerSize(){
    const controller = $('.js_controller').eq(0)
    if(!controller) return
    let screenW = window.screen.width
    let viewW = window.outerWidth
    let result = (viewW/screenW).toFixed(2)
    controller.css({zoom:result})
}

function activeRadio(){
    $('.js_os_label').on('click', function(){
        $('.js_os_label').removeClass('os__input--checked')
        if( $(this).find('input').prop('checked') ){
            $(this).addClass('os__input--checked')
        }
    })
}

function activeParticles(){
    const canvas = document.getElementById("particles");
    if( !canvas ) return 
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.2) this.size -= 0.1;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            if (particlesArray[i].size <= 0.2) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }

    function createParticles() {
        if (particlesArray.length < 100) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        createParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function keyController(){
    /*
        WASD => 스크롤 이동
        ZXCV => 페이지 이동
        F    => ...효과 ? 다크모드 ?
    */
    const keyZ = $('.button__key-z').eq(0)
    const keyX = $('.button__key-x').eq(0)
    const keyC = $('.button__key-c').eq(0)
    const keyV = $('.button__key-v').eq(0)
    const keyF = $('.button__key-f').eq(0)
    const keyW = $('.joystick__key-w').eq(0)
    const keyA = $('.joystick__key-a').eq(0)
    const keyS = $('.joystick__key-s').eq(0)
    const keyD = $('.joystick__key-d').eq(0)
    const lever = $('.joystick__lever').eq(0)
    const class_pressed = 'button--pressed'
    const class_counting = 'button--counting'
    const keys = [
        {
            name:'keyZ',
            key:keyZ,
            isPressed:false,
            counting:0,
            minCount:3,
            matchingSection:'visual'
        },{
            name:'keyX',
            key:keyX,
            isPressed:false,
            counting:0,
            minCount:3,
            matchingSection:'book'
        },{
            name:'keyC',
            key:keyC,
            isPressed:false,
            counting:0,
            minCount:3,
            matchingSection:'event'
        },{
            name:'keyV',
            key:keyV,
            isPressed:false,
            counting:0,
            minCount:3,
            matchingSection:'character'
        },{
            name:'keyW',
            key:keyW,
            isPressed:false,
        },{
            name:'keyA',
            key:keyA,
            isPressed:false,
        },{
            name:'keyS',
            key:keyS,
            isPressed:false,
        },{
            name:'keyD',
            key:keyD,
            isPressed:false,
        },{
            name:'keyF',
            key:keyF,
            isPressed:false,
            counting:0,
            minCount:3,
            matchingSection:'book'
        },
    ]
    function goToSection(i){
        /* PC 구현 => 모바일에서 해당 기능 꼭 체크 */
        let link = document.createElement('a')
        link.href=`#${keys[i].matchingSection}`
        link.click()
    }
    function cssActivePress(key){
        key.addClass(class_pressed)
        setTimeout(()=> key.removeClass(class_pressed) ,200)
    }
    function cssStartCounting(key){
        setTimeout(() => { // 처음 누를때 버튼active 효과색이 안보이므로 0.3초후 시작
            key.addClass(class_counting)
        }, 400)
    }
    function cssEndCounting(key){
        key.removeClass(class_counting)
    }
    function moveToLeverUI(idx){
        let direction = keys[idx].key.data('position').split('-')[0]
        let value = keys[idx].key.data('position').split('-')[1]
        lever.css(direction, value+"%")
        setTimeout(() => resetLever(), 200)
    }
    function resetLever(){
        lever.css({top:'50%',left:'50%', right:'auto', bottom:'auto'})
    }
    function moveToLeverFn(idx){
        // W,A==Up / S,D==Down
        let nowScrollTop = $('.main__section').scrollTop()
        let value = keys[idx].name=='keyW' || keys[idx].name=='keyA' ? -500 : +500
        $('.main__section').stop().animate({scrollTop:nowScrollTop+(value)},200)
    }

    // setInterval(()=> console.log( keys[0].counting), 1000)

    function controllToZXCV(i){
        /* r = 알파벳, i = 인덱스 */
        // if( code == `Key${r}`){
            if( keys[i].isPressed==false && keys[i].counting==0){
                // 페이지 이동
                goToSection(i)

                // X 버튼 = 모델 메시지
                if( i==1 ) {
                    typingModelMessage()
                }

                // 화면 구현 스타일링
                cssActivePress(keys[i].key)
                cssStartCounting(keys[i].key)
                keys[i].key.children().text( keys[i].minCount )

                // 카운팅 제어
                keys[i].isPressed=true;
                keys[i].counting=keys[i].minCount;

                // 카운팅 시작
                let startCounting = setInterval(() => {
                    if( keys[i].counting===0 ){
                        clearInterval(startCounting)
                        keys[i].key.children().text(String(keys[i].name.split('y')[1]))
                        keys[i].isPressed=false
                        cssEndCounting(keys[i].key)
                    }else{
                        keys[i].counting--
                        keys[i].key.children().text(keys[i].counting)
                    }
                },1000)
            }
        // }
    }

    // 마우스 클릭
    $('.controller__button button').on('click', function(){
        let idx = $(this).index()
        controllToZXCV(idx)
    })

    // 키보드 누름
    $(window).on("keydown", (e) => {
        // 사전예약 input 에 포커싱됐을때 모든 컨트롤러 기능 정지
        focusEle = document.activeElement;
        if (document.getElementById('phone') == focusEle) return

        // ZXCVF
        let alphabet = e.code.charAt(e.code.length - 1)
        let idx = Number(
            alphabet=='Z' && 0 ||
            alphabet=='X' && 1 ||
            alphabet=='C' && 2 ||
            alphabet=='V' && 3 ||
            alphabet=='W' && 4 ||
            alphabet=='A' && 5 ||
            alphabet=='S' && 6 ||
            alphabet=='D' && 7 ||
            alphabet=='F' && 8
        )
        if( alphabet=='Z'||alphabet=='X'||alphabet=='C'||alphabet=='V'||alphabet=='F' ){
            controllToZXCV(idx)
        }

        // WASD, up down left right
        alphabet = (e.code=='KeyW' || e.code=='ArrowUp') && 'W' ||
                   (e.code=='KeyA' || e.code=='ArrowLeft') && 'A' ||
                   (e.code=='KeyS' || e.code=='ArrowDown') && 'S' ||
                   (e.code=='KeyD' || e.code=='ArrowRight') && 'D'
        if( alphabet=='W'||alphabet=='A'||alphabet=='S'||alphabet=='D' ){
            moveToLeverUI(idx)
            moveToLeverFn(idx)
        }

        /* if(e.code=='KeyF'){
            cssActivePress(keyF)
        } */
    });
}

function typingModelMessage(){
    const $messageTyping = $('.js_message_typing').eq(0)
    const typingText = $messageTyping.data('typing').split('')
    let i=0;
    $messageTyping.empty()
    const typing = setInterval(() => {
        if(i==typingText.length-1) {
            clearInterval(typing)
        }
        $messageTyping.append(typingText[i])
        return i++
    },140)
}
function activePopup() {
    const $popup = $('.js_popup')

    function movingCursor($cursor) {
        let cursorW = ($cursor.width()) / 2;
        document.addEventListener('mousemove', function (e) {
            let x = e.pageX;
            let y = e.pageY;
            $cursor.css({
                top: (y - cursorW) + 'px',
                left: (x - cursorW) + 'px'
            })
        })
    }

    // show popup
    $('.js_button_popup').on('click', function () {
        // popup
        const name = $(this).data('name')
        $(`.js_popup.${name}`).css({display: 'flex'})

        // cursor
        const $cursor = $(`.js_popup.${name}`).find('.js_cursor')
        $cursor.show()
        movingCursor($cursor)
        $($cursor, '.js_bg').on('click', function () {
            $popup.hide()
            $cursor.hide()
        });
    })
}


async function changeCharacter(){
    const characterData = await fetch("/data/character.json").then(response => {
        return response.json();
    })

    /*************************************
    1. 캐릭터 타입 선택 (상단 3가지)
    *************************************/
    const $contBox = $('.js_cont_box')
    $contBox.on('mouseenter', function(){
        const type = $(this).data('type')
        changeBg(type)
    })

    $contBox.on('click', function(){
        const type = $(this).data('type')
        $contBox.off('mouseenter')

        // char- type
        $('.character__title').hide()
        $('.js_cont_box').removeClass('active')
        $(this).addClass('active').parent().addClass('active')

        // open popup
        $('.character__popup').addClass('active').show()
        $('.js_char_bg').show()

        changeBg(type)
        changeDetails(type, 0)
    })

    function changeBg(type){
        $('.character__bg img[class^="bg__"]').hide()
        $(`.bg__${type}`).css({zIndex:1}).hide().fadeIn(700)
    }

    /*************************************
    2. 각 캐릭터 선택
    *************************************/
    const $details = $('.js_char_detail').eq(0)
    const $name = $('.js_name').eq(0)
    const $native = $('.js_native').eq(0)
    const $job = $('.js_job').eq(0)
    const $personal = $('.js_personal').eq(0)
    const $story = $('.js_story').eq(0)

    $('.js_btn_char').on('click', function(){
        const idx = $(this).index()
        const type = $(this).parent().data('type')
        changeDetails(type, idx)
    })

    function changeDetails(type, idx){
        $(`.button__wrapper__${type} .js_btn_char`).eq(idx).addClass('active').siblings('.active').removeClass('active')
        $(`.button__wrapper__${type}`).css({display:'flex'}).siblings().hide()

        if( type == 'stars' ) character = characterData.stars
        else if( type == 'marchen' ) character = characterData.marchen
        else if( type == 'tales' ) character = characterData.tales

        $name.text(character[idx].name)
        $native.text(character[idx].native)
        $job.text(character[idx].job)
        $personal.text(character[idx].personal)
        $story.text(character[idx].storytelling)
        $details.find('.js_char_img').attr({
            src:`/img/character/char_${type}_${character[idx].primary}.png`,
            alt:character[idx].primary
        })
    }
}





function bookFromUser(){
    const $aos = $('#aos')
    const $ios = $('#ios')
    const $phone = $('#phone')
    const $confirm1 = $('#confirm1')
    const $confirm2 = $('#confirm2')

    if( ($aos.prop('checked') == false) && ($ios.prop('checked') == false) ) {
        alert('휴대폰 OS를 선택해주세요')
        return false;
    }
    if( $phone.val().trim() == "" ) {
        alert('휴대폰 번호를 입력해주세요')
        $phone.focus();
        return false;
    }
    if( $phone.val().trim().length < 10 ) {
        alert('휴대폰 번호를 정확히 입력해주세요')
        $phone.focus();
        return false;
    }
    if($confirm1.prop('checked') != true){
        alert("이벤트알림 수신에 동의해주세요");
        $confirm.focus();
        return false;
    }
    if($confirm2.prop('checked') != true){
        alert("개인정보 수집에 동의해주세요");
        $confirm.focus();
        return false;
    }
    const date = new Date().toISOString().substring(0, 10); // DB 형식에 맞춤
    const os = $aos.prop('checked') ? $aos.val() : $ios.val()
    const phone = $phone.val()
    const data = {
        os: os,
        phone:phone,
        date:date
    }

    $.ajax({
        url:'/api/book', //request 보낼 서버의 경로
        type:'post', // 메소드(get, post, put 등)
        contentType: 'application/json',
        // dataType: 'json', // 서버에서 반환될 데이터 타입
        data: JSON.stringify(data),
        success: function(data, textStatus, xhr) {
            alert('사전예약이 완료되었습니다.')
            showUserFromDB();
        },
        error: function(xhr, textStatus, errorThrown) {
            if( xhr.status==502 ) {
                alert('이미 사전예약에 참여한 휴대폰번호입니다.')
            }else{
                alert('사전예약에 실패했습니다. 다시 시도해주세요')
            }
        }
    });
}
