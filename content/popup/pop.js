
export const initPopMsg = elements => {
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
            pageScroll.able();
        }
    };
    window.addEventListener('keyup', keyupEvent);
};
