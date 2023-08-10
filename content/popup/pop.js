/* constant.js */
const keyboard = {
    tab: 9,
    enter: 13,
    shift: 16,
    esc: 27,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    home: 36,
    end: 35,
    pgdn: 34,
    pgup: 33,
};
/* utils.js */
const pageScroll = {
    element: document.documentElement,
    able() {
        const { element: page } = this;
        page.removeAttribute('style');
    },
    disable() {
        const { element: page } = this;
        const style = `overflow:hidden`;
        page.setAttribute('style', style);
    },
};

/* popMsg.js */
let focusBtn;
const closeEvent = btn => {
    const targetCont = btn.closest('.c-pop-msg');
    targetCont.classList.remove('active');
    targetCont.removeAttribute('tabindex');
    const allLayerHidden = !(
        0 < [...document.querySelectorAll('.c-pop-msg')].filter(layer => layer.classList.contains('active')).length
    );
    if (allLayerHidden) pageScroll.able();

    const contentsBox = btn.closest('.c-pop-msg').querySelector('.c-pop-msg__contents');
    const needToReset = contentsBox && contentsBox.classList.contains('c-pop-msg__contents--reset');

    // Reset From
    const form = btn.closest('.c-pop-msg').querySelector('.c-pop-msg-form');
    const countingNumber = form?.querySelectorAll('.counting-num');
    if (needToReset && form) {
        form.reset();
        if (countingNumber) {
            countingNumber.forEach(element => {
                const updateElement = element;
                updateElement.textContent = 0;
                return updateElement;
            });
        }
    }
};

const initLayerPopup = layer => {
    // If there is a video in the layer popup, force the video to turn off.
    const btnVideoClose = layer.querySelectorAll('.js-video-close');
    if (btnVideoClose.length > 0) {
        btnVideoClose.forEach(close => {
            close.click();
        });
    }
    // If there is a carousel inside the layer popup, go to the first slide
    const carousels = layer.querySelectorAll('.cmp-carousel');
    if (carousels.length > 0)
        carousels.forEach(el => {
            if (el.swiper) el.swiper.slideTo(0);
        });
};

const popMsg = function (href, popOpenBtn = false) {
    // href = href value or id value
    const popCloseBtns = document.querySelectorAll('.js-pop-close');
    const popId = href?.replace('#', '');
    const targetCont = document.getElementById(popId);
    const targetContButtons = targetCont.querySelectorAll('a, button, input, textarea');
    const dimmed = targetCont.querySelector('.c-pop-msg__dimmed');
    targetCont.classList.add('active');
    targetCont.setAttribute('tabindex', '0');
    // move focus to specific element when modal is opened.
    if (targetCont.dataset.focusSelector) {
        targetCont.querySelector(targetCont.dataset.focusSelector)?.focus();
    } else {
        // else move the focus to modal itself
        targetCont.focus();
    }

    if (popOpenBtn) focusBtn = popOpenBtn;

    // page scroll
    pageScroll.disable();

    // close
    popCloseBtns.forEach(b =>
        b.addEventListener('click', () => {
            initLayerPopup(b.closest('.c-pop-msg'));
            closeEvent(b);
            if (focusBtn) focusBtn.focus();
        })
    );
    // dimmed
    dimmed.addEventListener('click', () => {
        const closeBtn = dimmed.closest('.c-pop-msg').querySelector('.c-pop-msg__close-button');
        if (closeBtn) closeBtn.click();
        else closeEvent(dimmed);
        if (focusBtn) focusBtn.focus();
    });
    // activateLoopFocus({
    //     nodeList: targetContButtons,
    //     layerClass: '.c-pop-msg',
    //     targetSelector: 'a, button, input, textarea',
    // });
};

const initPopMsg = elements => {
    const popOpenBtns = elements;
    popOpenBtns.forEach(function (btn) {
        // href = href value or id value
        let href = btn.getAttribute('aria-controls') || btn.getAttribute('href');
        href = href?.replace('#', '');
        btn.addEventListener('click', function (event) {
            // Prevent scrolling up after layer popup
            event.preventDefault();
            if (btn.getAttribute('disabled') === null) {
                popMsg(href);
                focusBtn = btn;
            }
        });
    });
    const keyupEvent = function (event) {
        const key = event.keyCode;
        if (key === keyboard.esc) {
            const popLayer = document.querySelectorAll('.c-pop-msg');
            popLayer.forEach(layer => {
                if (layer.classList.contains('active')) {
                    initLayerPopup(layer);
                }
                layer.classList.remove('active');
            });
            if (focusBtn) focusBtn.focus();
            // pageScroll.able();
        }
    };
    window.addEventListener('keyup', keyupEvent);
};