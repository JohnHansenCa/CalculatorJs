// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as Popper from "https://unpkg.com/@popperjs/core@2.11.6/dist/esm/popper.js";
import { Util } from "./util.js";
/**
 * HtmlElement data attributes supported by {@link kp}.
 */
const dataAttribute = Object.freeze({
    KP: "data-kp",
    VALUE: "data-kp-value",
    LABEL: "data-kp-label",
    KPDISPLAY: "data-kp-display",
    KPTARGET: "data-kp-target",
    PLACEMENT: "data-kp-placement"
});
/** Identifies the kind of kp such as {@link Key}, {@link Container} etc*/
class Kind {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    toString() {
        return this._name;
    }
}
/** string 'key' */
Kind.KEY = "key";
/** string 'display' */
Kind.DISPLAY = "display";
/** string 'grid-container' */
Kind.GRID_CONTAINER = "grid-container";
/** string 'flex-container' */
Kind.FLEX_CONTAINER = "flex-container";
/** string 'list-container' */
Kind.LIST_CONTAINER = "list-container";
// TODO: is this required?
/** string 'dropdown-key'*/
Kind.DROPDOWN_KEY = "dropdown-key";
// TODO: is this required?
/** string 'item-key' */
Kind.ITEM = "item-key";
/** string 'show-key' */
Kind.SHOW = "show-key";
/** string 'popup-key' */
Kind.POPUP = "popup-key";
/** string 'none' */
Kind.NONE = "none";
/** Identifies the kp object as {@link Key} */
Kind.Key = new Kind(Kind.KEY);
/** Identifies the kp object as {@link Display} */
Kind.Display = new Kind(Kind.DISPLAY);
/** Identifies the kp object as {@link Container} */
Kind.Container = new Kind(Kind.GRID_CONTAINER);
/**  Identifies the kp object as 'item' {@link Key}  */
Kind.Item = new Kind(Kind.ITEM);
/** Identifies the kp object as 'show' */
Kind.Show = new Kind(Kind.SHOW);
/** Identifies the kp object as 'Popup' */
Kind.Popup = new Kind(Kind.POPUP);
/** Identifies the kp object as none */
Kind.None = new Kind(Kind.NONE);
class DefaultListner {
    static get key() {
        return DefaultListner._key;
    }
    static set key(keyListner) {
        DefaultListner._key = keyListner;
    }
}
//   /**
//  * Gets the {@link Display} instance for the given element. 
//  * If there no instance then an instance will be created.
//  * Returns null if there is a problem.
//  * TODO: fix returning of null and generating error messages
//  * @param elementId 
//  * @returns 
//  */
// function getDisplay(elementId: string):Display{
//     return Display.getInstance(elementId);
// }
// function getContainer(elementId: string):Container;      //Overloaded signature
// function getContainer(element: HTMLElement):Container;   //Overloaded signature
// /**
//  * Creates or retrieves a @see kpuiContainer
//  * @param elementId 
//  * @returns 
//  */
// function getContainer(e:never):Container{
//     return Container.getInstance(e);
// }
// function getKey(elementId: string):iKp;       //Overloaded signature
// function getKey(element: Element):iKp;        //Overloaded signature  
// function getKey(e: never):iKp{
//     //return Key.getInstance(e); 
//     return null;
//     }
let _countId = 0;
/**
 * Returns a unique ID by adding a number to the string startOfId. For example
 * create an id with the name "key" +{\\\}
 * @param startOfId
 * @returns
 */
function createUniqueId(startOfId) {
    let loopCount = 0;
    while (loopCount < 1000) {
        const newId = startOfId + _countId.toString();
        const e = document.getElementById(newId);
        if (e === null)
            return newId;
        loopCount = loopCount + 1;
        _countId = _countId + 1;
    }
    throw new Error('static kpui.CreateUnigyueId failed after 1000 numbers. WTF!');
}
//let body =document.getElementsByTagName('body')[0] as HTMLElement;
//body.style.visibility = "hidden";
//const resultDiv:HTMLElement;
//let mathResultDiv:HTMLElement;
//type eventHandlerType = (event: Event)=> void;
const buttonEventHandler = function (event) {
    const element = event.target;
    // if(resultDiv != null)
    //     resultDiv.innerText = resultDiv.innerText + element.innerText;
    // TODO: change to element.kpObject.getElementValue(element)
    if (DefaultListner.key != null)
        DefaultListner.key(element.innerText, element);
};
/** An array that contains a list of the currenlty open popup containers. */
let popupContainers = [];
const popupEventHandler = function (event) {
    const element = event.target;
    const puContainer = element.nextElementSibling; // todo: this is too simple, need to check
    const isSomeParentPopup = parentPopupKey(element) != null;
    if (popupContainers.includes(puContainer)) {
        if (popupContainers[0] == puContainer) {
            closeAllPopups();
        }
        else {
            closeSomePopups(puContainer);
        }
    }
    else if (parentPopupKey(element) != null) {
        Popper.createPopper(element, puContainer, {
            placement: 'right',
        });
        //TODO: close peer popup containers if open 
        // TODO: create util.popupContainer(popupelement) and util.peerPopupContainer(puContainer);
        // TODO: add unit tests for this-
        closePeerContainers(puContainer);
        //puContainer.classList.remove("kp-hide");
        puContainer.style.display = "";
        window.dispatchEvent(new Event('resize'));
        popupContainers.push(puContainer);
    }
    else {
        if (!isSomeParentPopup && popupContainers != null)
            closeAllPopups();
        //puContainer.classList.remove("kp-hide");
        puContainer.style.display = "";
        window.dispatchEvent(new Event('resize'));
        popupContainers.push(puContainer);
    }
    event.stopPropagation();
};
const showOnlyEventHandler = function (event) {
    const element = event.target;
    // const attr = Util.getKpAttribute(element, "data-kp-target");
    // if(attr === "")return;
    // const target = document.getElementById(attr);
    const target = Util.getTarget(element);
    if (target == null)
        return;
    showOnly(target);
    event.stopPropagation();
};
function showOnly(target) {
    const parent = target.parentElement;
    Array.from(parent.children).forEach(element => {
        if (element != target) {
            element.style.display = "none";
            //           element.classList.remove(selectCssClass);
        }
    });
    target.style.display = "";
    //    target.classList.add(selectCssClass);
}
const closeAllPopupsHandler = function (event) {
    closeAllPopups();
    event.stopPropagation;
};
const closeAllPopups = function () {
    popupContainers.forEach(e => hidePopup(e));
    popupContainers = [];
};
function closeSomePopups(puContainer) {
    hidePopup(puContainer);
    let topVisible = popupContainers.pop();
    while (popupContainers.length > 0 && topVisible != puContainer) {
        topVisible = popupContainers.pop();
        hidePopup(topVisible);
    }
}
/** Closes 1 peer container if open */
function closePeerContainers(element) {
    let openContainer = null;
    Array.from(element.parentElement.children).forEach(element => {
        popupContainers.forEach(container => {
            // there should only be 1 openContainer
            if (container === element)
                openContainer = element;
        });
    });
    if (openContainer != null)
        closeSomePopups(openContainer);
}
function hidePopup(e) {
    if (e != null)
        e.style.display = "none";
    // e.classList.add("kp-hide");
}
function parentPopupKey(e) {
    let parentDiv = e.parentElement;
    let _parentPopupKey = null;
    while (parentDiv != null) {
        _parentPopupKey = parentDiv.previousElementSibling;
        if (_parentPopupKey != null) {
            const s = _parentPopupKey.getAttribute("data-kp");
            if (s == 'popup-key') {
                break;
            }
        }
        parentDiv = parentDiv.parentElement;
    }
    return _parentPopupKey;
}
let selectCssClass = "";
addEventListener('DOMContentLoaded', (event) => {
    const body = document.getElementsByTagName("body")[0];
    selectCssClass = Util.getKpAttribute(body, "data-kp-select");
    //let body = document.getElementsByTagName("body")[0];
    //body.style.visibility = "hidden";
    //resultDiv = document.getElementById("resultDiv");
    //let keyColl:HTMLCollectionOf<Element> = document.getElementsByClassName("kp-key");
    const keys = Array.from(document.querySelectorAll("[data-kp]"));
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "popup-key") {
            element.addEventListener("click", popupEventHandler);
            //let d = window.getComputedStyle(element.nextElementSibling, null).display;
            //(element as any).kpDisplayStyle = d;
            // (element.nextElementSibling as HTMLElement).style.display = "none";
        }
        // else if(element.getAttribute("data-kp") === "key"){
        //     element.addEventListener("click", buttonEventHandler);
        // }
    });
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "key") {
            element.addEventListener("click", buttonEventHandler);
        }
    });
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "popup-key") {
            let _placement = Util.getKpAttribute(element, dataAttribute.PLACEMENT);
            if (_placement === "")
                _placement = 'right';
            Popper.createPopper(element, element.nextElementSibling, {
                placement: _placement,
            });
        }
    });
    keys.forEach(element => {
        if (element.getAttribute("data-kp") === "show-only-key") {
            element.addEventListener("click", showOnlyEventHandler);
            const target = Util.getTarget(element);
            if (target != null && target.style.display === "") {
                showOnly(target);
            }
        }
    });
    //mathResultDiv = document.getElementById("mathResultDiv");
    document.addEventListener("click", closeAllPopupsHandler);
    //resultDiv.addEventListener('DOMSubtreeModified', calculate);
    //body.style.visibility = "visible";
});
console.log("hi");
export { Kind, dataAttribute, createUniqueId, DefaultListner };
export { Display } from "./display.js";
export { Container } from "./container.js";
export { Key } from "./key.js";
//# sourceMappingURL=kp.js.map