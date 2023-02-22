import { Kind, dataAttribute } from "./kp.js";
/**
 * kpUtil is a singleton class containing utility methods.  Access this methods via
 * {@link kp.Util}
 */
class kpUtil {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    setClasses(element, classes = []) {
        /* TODO: error checking on parameters */
        classes.forEach(cls => {
            element.classList.add(cls);
        });
    }
    addDefaultKeyInfo({ label, value = "", id = "", classes = [], kind = Kind.None, target = null }) {
        return { label: label, value: value, id: id, classes: classes, kind: kind, target: target };
    }
    // addDefaultKeyInfoToChild(info:iKpKeyInfo):iKpKeyInfo{
    //     if(this.isValidObject(info.child)){
    //         return this.addDefaultKeyInfo(info.child);
    //     }
    //     else{
    //         return {label:"", value:"", classes:[], kind:kpKind.None, target:null};
    //     }
    // }
    isValidObject(obj) {
        return (obj != undefined && obj != null);
    }
    addDefaultKeyInfoArray(infoArray) {
        const returnArray = [];
        infoArray.forEach(item => {
            returnArray.push(this.addDefaultKeyInfo(item));
        });
        return returnArray;
    }
    /** Returns the element width including margins as string in the format 'Npx' where N is a number
     * indicating the width. */
    getElementWidth(element, multiplier = 1) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const margin = Number(style.marginLeft.replace("px", "")) * 2;
        return ((rect.width + margin) * multiplier).toString() + "px";
    }
    isElmentDiv(element) {
        return element.nodeName === "DIV";
    }
    /** Returns an empty string, "", if not found. */
    getKpAttribute(element, attr) {
        const attrValue = element.getAttribute(attr);
        if (attrValue == null)
            return "";
        else
            return attrValue;
    }
    getTarget(element) {
        const attr = Util.getKpAttribute(element, "data-kp-target");
        if (attr === "")
            return null;
        const target = document.getElementById(attr);
        return target;
    }
    getChildContainer(element) {
        let containerElement = null;
        Array.from(element.children).forEach(e => {
            const attr = e.getAttribute(dataAttribute.KP);
            if (attr != null && attr.match("container") != null)
                containerElement = e;
        });
        // if no element found with container atttribute, then return the first div element
        if (containerElement == null) {
            Array.from(element.children).forEach(e => {
                const attr = e.getAttribute(dataAttribute.KP);
                if (attr == null && this.isElmentDiv(element))
                    containerElement = e;
            });
        }
        return containerElement;
    }
    createChildContainerElement(element) {
        const container = document.createElement("div");
        element.appendChild(container);
        return container;
    }
    // createContainer(element:HTMLElement):Container{
    //     return getContainer(element);
    // }
    addKpAttributeIfRequired(e, kind) {
        const attr = e.getAttribute(dataAttribute.KP);
        if (attr != null)
            return;
        e.setAttribute(dataAttribute.KP, kind.name);
    }
    setGridColumns(e, n = 1) {
        e.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    }
    /**
     * Returns true if the element has a 'data-kp' attribute with the value specified by kind:{@link Kind},
     * otherwise returns false;
     * @param element
     * @param kind
     * @returns
     */
    isKind(element, kind) {
        const attr = element.getAttribute(dataAttribute.KP);
        if (attr == null)
            return false;
        if (attr === kind.name)
            return true;
        return false;
    }
}
kpUtil.Instance = new kpUtil();
/**
 * kpUtil is a singleton class containing utility methods.  Access this methods via
 * {@link kp.Util}
 */
class kpCss {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        /**  "kp-green" */
        this.GREEN = "kp-green";
        /**  "kp-red" */
        this.RED = "kp-red";
        /**  "kp-blue" */
        this.BLUE = "kp-blue";
        /**  "kp-yellow" */
        this.YELLOW = "kp-yellow";
        /**  "kp-orange" */
        this.ORANGE = "kp-orange";
        this.KPKEY = "kp-key";
        this.KPKEYSTYLE = "kp-key-style";
        this._defaultKeyClasses = [this.KPKEY, this.KPKEYSTYLE, "kp-color"];
    }
    /**
     * The default classes assigned to a key.
     */
    get defaultKeyClasses() {
        return this._defaultKeyClasses;
    }
}
kpCss.Instance = new kpCss();
/** Contains a number of utility methods */
const Util = kpUtil.Instance;
const Css = kpCss.Instance;
export { kpUtil, Util, Css };
//# sourceMappingURL=util.js.map