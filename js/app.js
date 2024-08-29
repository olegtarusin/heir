(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const BODY = document.body;
    const header = BODY.querySelector(".header");
    const footer = BODY.querySelector(".footer");
    let observerOptions = {
        root: null,
        threshold: .2
    };
    let sw = getScrollWidth();
    let callback = function(entres, observer) {
        entres.forEach((entry => {
            function setNextPrevAnima() {
                let animaList = document.querySelectorAll(".anima");
                animaList = Array.from(animaList);
                pageChildren.forEach((pageChild => {
                    pageChild.classList.remove("anima-prev");
                    pageChild.classList.remove("anima-next");
                }));
                if (animaList.length > 0) {
                    let firstAnima = animaList[0];
                    let lastAnima = animaList[animaList.length - 1];
                    let animaPrev, animaNext;
                    animaPrev = firstAnima.previousElementSibling;
                    animaNext = lastAnima.nextElementSibling;
                    if (animaPrev) animaPrev.classList.add("anima-prev");
                    if (animaNext) animaNext.classList.add("anima-next");
                }
            }
            if (entry.isIntersecting) {
                entry.target.classList.add("anima");
                setNextPrevAnima();
                if (entry.target.closest(".page-scroll") && entry.target == pageChildren[0]) BODY.classList.remove("page-scroll");
                if (pageChildren[0].offsetHeight >= window.innerHeight) if (entry.target == pageChildren[1]) BODY.classList.add("page-scroll");
            }
            if (!entry.isIntersecting) {
                entry.target.classList.remove("anima");
                setNextPrevAnima();
                if (entry.target == pageChildren[0]) BODY.classList.add("page-scroll");
            }
        }));
    };
    var observer = new IntersectionObserver(callback, observerOptions);
    const page = document.querySelector(".page");
    var pageChildren = page.children;
    pageChildren = Array.from(pageChildren);
    let strokeObservOption = {
        root: null,
        threshold: .2
    };
    let strokeObservCallback = function(entres, strokeObservObserver) {
        entres.forEach((entry => {
            if (entry.isIntersecting) {
                let svgPath = entry.target.querySelector("path");
                let svgLength = svgPath.getTotalLength();
                entry.target.style.cssText = `\n                  stroke-dasharray: ${svgLength};\n                transition: all ${svgLength}ms linear ${Number(entry.target.dataset.animaDelay)}s;\n                `;
            }
            if (!entry.isIntersecting) {
                let svgPath = entry.target.querySelector("path");
                let svgLength = svgPath.getTotalLength();
                entry.target.style.cssText = `\n                    stroke-dasharray: ${svgLength};\n                stroke-dashoffset: ${svgLength};\n                `;
            }
        }));
    };
    var strokeObservObserver = new IntersectionObserver(strokeObservCallback, strokeObservOption);
    let strokeList = document.querySelectorAll("svg");
    function addObserv() {
        strokeList.forEach((svg => {
            strokeObservObserver.observe(svg);
        }));
        pageChildren.forEach((child => {
            observer.observe(child);
        }));
    }
    function unborder(unborderobject, bordercontent, borderbody, bordercontainer) {
        let unborder = document.querySelector(unborderobject);
        let content = document.querySelector(bordercontent);
        let body = document.querySelector(borderbody);
        let container = document.querySelector(bordercontainer);
        let widthContent;
        let widthMargin;
        let widthPadding;
        if (unborder && container && body && content) {
            content.style.flex = ``;
            unborder = unborder.getBoundingClientRect().width;
            unborder = Math.round(unborder);
            body = body.getBoundingClientRect().width;
            widthPadding = parseFloat(window.getComputedStyle(container).paddingRight);
            container = container.getBoundingClientRect().width;
            widthMargin = (body - container) / 2;
            widthContent = body - unborder - widthMargin - widthPadding;
            content.style.flex = `0 0 ${widthContent}px`;
        }
    }
    function getStrokeLengthAnimation() {
        let svgList = document.querySelectorAll("svg");
        if (svgList.length > 0) svgList.forEach((svg => {
            let svgPath = svg.querySelector("path");
            let svgLength = svgPath.getTotalLength();
            svg.style.cssText = `\n                stroke-dasharray: ${svgLength};\n    \t\tstroke-dashoffset: ${svgLength};\n            `;
        }));
    }
    function globalTouchStart(e) {
        touchHover(e);
    }
    function globalTouchEnd(e) {
        touchHover(e);
    }
    function touchHover(e) {
        if (e.type == "touchstart") e.target.classList.add("hover");
        if (e.type == "touchend") if (e.target.closest(".hover")) e.target.closest(".hover").classList.remove("hover");
    }
    function loader(mainline, subline, text) {
        let mainElem = document.querySelector(mainline);
        let subElem, textElem;
        if (mainElem) mainElem.style.left = `0%`;
        if (subline) {
            subElem = document.querySelector(subline);
            subElem.style.left = `0%`;
        }
        if (text) {
            textElem = document.querySelector(text);
            textElem.innerText = `0%`;
        }
        let imglist = document.querySelectorAll("img");
        let imgCount = 0;
        let value;
        function hideLoader() {
            BODY.classList.add("loaded");
            addObserv();
        }
        function loadCount() {
            ++imgCount;
            value = imgCount / imglist.length * 100;
            value = Math.round(value);
            if (mainElem) mainElem.style.left = `${value}%`;
            if (subElem) subElem.style.left = `${value}%`;
            if (textElem) textElem.innerText = `${value}%`;
            if (value == 100) setTimeout(hideLoader, 1e3);
        }
        imglist.forEach((image => {
            let imageClone = new Image;
            imageClone.src = image.src;
            imageClone.onload = loadCount;
            imageClone.onerror = loadCount;
        }));
    }
    function resizer() {
        unborder(".about-bottom__big-image", ".about-bottom__content", ".about-bottom__body", ".about-bottom__container");
        sw = getScrollWidth();
    }
    function popupos(e, link) {
        let pop;
        let popOpen;
        if (e.target.closest(`[data-pop-link="${link}"]`)) {
            if (e.target.closest("a")) e.preventDefault();
            pop = document.querySelector(`[data-pop="${link}"]`);
            popOpen = document.querySelector(".popup-open");
            if (popOpen && popOpen != pop) {
                popOpen.classList.remove("popup-open");
                BODY.classList.remove("pop-block");
            }
            if (pop) {
                holdPop(e, header);
                holdPop(e, footer);
                pageChildren.forEach((pchild => {
                    holdPop(e, pchild);
                }));
                pop.classList.toggle("popup-open");
                BODY.classList.toggle("pop-block");
            }
        }
        if (e.target.closest(".popup-open") && (e.target.closest("[data-pop-close]") || !e.target.closest("[data-pop-body]"))) {
            pop = e.target.closest(".popup-open");
            holdPop(e, header);
            holdPop(e, footer);
            pageChildren.forEach((pchild => {
                holdPop(e, pchild);
            }));
            pop.classList.remove("popup-open");
            BODY.classList.remove("pop-block");
        }
    }
    function getScrollWidth() {
        let div = document.createElement("div");
        div.style.overflowY = "scroll";
        div.style.width = "50px";
        div.style.height = "50px";
        document.body.append(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
    }
    function holdPop(e, node) {
        if (e.target.closest(".pop-block")) node.style.paddingRight = `0px`; else node.style.paddingRight = `${sw}px`;
    }
    function globalClick(e) {
        popupos(e, "form");
    }
    loader(".loader__progressline", null, ".loader__text");
    unborder(".about-bottom__big-image", ".about-bottom__content", ".about-bottom__body", ".about-bottom__container");
    getStrokeLengthAnimation();
    window.addEventListener("resize", resizer);
    document.addEventListener("touchstart", globalTouchStart);
    document.addEventListener("touchend", globalTouchEnd);
    document.addEventListener("click", globalClick);
    window["FLS"] = true;
    isWebp();
    menuInit();
})();