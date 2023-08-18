// history log
// 22.11.??
// - separated folding feature to "single" and "sync".
// 22.12.20
// - change to collect each element using "id" attribute.
// - change first parameter of "...fonding" function "el" to "box".
//   + The "closest" api climbs up DOM tree and returns the first matching selector.
// - change "click" event bind target
//   + consider to nested accordion module.
//   + so remove "filter event target" code.
// - add feature "All".


// util.js
function beforeLaunch(DOM) {
    // console.log("beforeLaunch")
    // case : DOM catch by querySelector.
    if (null == DOM) return true;
    // case : HTMLCollection or NodeList or what mutate them.
    const isIterable = !!DOM[Symbol.iterator] || 0 <= DOM.length;
    const reject = isIterable ? 0 === DOM.length : null == DOM;
    if (reject) return true;
    // case : default
    return false;
}


const selector = {
    target: '.js-accordion:not(.js-accordion-initialized)',
    trigger: '.js-accordion-trigger',
    handleTarget: '.js-accordion-handle-target',

    // classname for status should be "c-accordion" block.
    // and recommend target element is ".c-accordion__box".
    box: '.c-accordion__box',
    contents: '.c-accordion__body',
    active: 'c-accordion__box--expand',
    offmode: 'c-accordion__box--turn-off',
    initialized: 'js-accordion-initialized',
};

const singleFolding = function (element, trigger) {
    console.log("singleFolding")
    // console.log('pair :', element, trigger);
    const status = element.classList.toggle(selector.active);
    trigger.setAttribute('aria-expanded', status);
    return status;
};

const syncFolding = function (element, trigger, targetRange) {
    // element => useCollectAccordion() -> box -> '.c-accordion__box'
    // trigger => useCollectAccordion() -> trigger -> // .c-accordion__body의 ID == 아코디언 버튼의 ID
    // targetRange => useCollectAccordion() -> siblings ->  ['.js-accordion-handle-target']
    console.log("syncFolding")
    const status = element.classList.contains(selector.active);
    // all accordion target status reset to negative
    targetRange.forEach(t => {
        // t => ['.js-accordion-handle-target']

        // 아코디언 닫기
        t.classList.remove(selector.active);
        // selector.active => .c-accordion__box--expand
        t.querySelector(selector.trigger).setAttribute('aria-expanded', false);
    });
    // set accordion box what clicked
    if (!status) {
        // 아코디언 열기
        element.classList.add(selector.active);
        // selector.active => .c-accordion__box--expand
        trigger.setAttribute('aria-expanded', true);
    }
};

const allOf = function (element, trigger, siblings) {
    console.log("allOf")
    const status = element.classList.contains(selector.active);
    if (status) {
        siblings.forEach(s => {
            s.classList.remove(selector.active);
            s.setAttribute('aria-expanded', false);
        });
        trigger.setAttribute('aria-expanded', false);
        return;
    }
    siblings.forEach(s => {
        s.classList.add(selector.active);
        s.setAttribute('aria-expanded', true);
    });
    trigger.setAttribute('aria-expanded', true);
};

const useCollectAccordion = function (el, siblings) {
    // accordion() -> el => .accordion-wrap03
    // accordion() -> siblings => ['.js-accordion-handle-target']

    const contents = el.querySelector(selector.contents);
    // selector.contents => '.c-accordion__body'

    const box = contents.closest(selector.box);
    // selector.box => '.c-accordion__box'

    const trigger = el.querySelector(`[aria-controls="${contents.getAttribute('id')}"]`);
    // .c-accordion__body의 ID == 아코디언 버튼의 ID

    const handler = function (event) {
        // // 1. filter event target
        // const correctButtonClick = trigger === event.target || event.target.closest(selector.trigger);
        // // 1-0. click element is not button... event break.
        // if (!correctButtonClick) return false;

        // 2. execute
        switch (box.dataset.expand) {
        // .c-accordion__box의 data-expand 의 값에 따라 케이스 적용
            // 2-3. active all under the {selector.target}
            case 'all':
                return allOf(box, trigger, siblings);
            // 2-2. active box by box
            case 'independent':
                return singleFolding(box, trigger);
            // 2-1. active sync other box
            default:
                return syncFolding(box, trigger, siblings);
                // .accordion-wrap03 > .c-accordion__box 에는 data-expand 없음 -> default 적용됨
                // box => '.c-accordion__box'
                // trigger => // .c-accordion__body의 ID == 아코디언 버튼의 ID
                // siblings =>  ['.js-accordion-handle-target']
        }
    };
    return [trigger, handler];
};

const accordion = function (root) {
    // console.log("accordion")
    const [...element] = root.querySelectorAll(selector.target);
    if (beforeLaunch(element)) return false;
    const allAccordionHandleTarget = element.map(el => [...el.querySelectorAll(selector.handleTarget)]).flat(1); // returns an un-nested array.

    allAccordionHandleTarget.forEach((el, index, self) => {
        console.log(el, "el")
        console.log(self, "self")
        const parent = el.closest(selector.target);
        if (parent) {
            parent.classList.add(selector.initialized);
        }
        const [trigger, handler] = useCollectAccordion(el, self);
        // el => .accordion-wrap03
        // self => ['.js-accordion-handle-target']
        trigger.addEventListener('click', handler, false);
    });
};


function init() {
    const component = document.querySelectorAll('.accordion-wrap03');
    if (beforeLaunch(component)) return false;
    // console.log("init")
    component.forEach(el => accordion(el));
    // el => .accordion-wrap03
}

init()