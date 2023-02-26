// import { kp, dataAttribute} from "./kp.js";
import { Kind } from "./kp.js";
import { Util } from "./util.js";
/**
 * DisplayConfig instance represents a keypad UI display control.
 * To create an instance add the attribute 'data-kp="display"' to an HTML element.
 * @classdesc
 */
class Display {
    /** private constructor. Use the factory function {@link getInstance} to get a new Display instance. */
    constructor(element) {
        this._element = element;
        this._element.kpObject = this;
        Display._instanceMap.set(element.id, this);
    }
    /**
     * 'getInstance' is a factory function used to create a new Display instance.
     * If the Display instance already exists it will be returned.
     * Returns {@link empty} if not found.
     * Returns null the elmentId refers to another type of data-kp.
     * @param elementId
     * @returns
     */
    static getInstance(elementId) {
        const instance = Display._instanceMap.get(elementId);
        if (instance != null) {
            return instance;
        }
        const element = document.getElementById(elementId);
        if (!Util.isKind(element, Kind.Display))
            return null;
        //todo: add error if elementID is not found
        if (element != null)
            return new Display(element);
        return Display._emptyDisplay;
    }
    /**
     * Returns an array of all kpDisplay instances.
     */
    static get displays() {
        //let v = kpDisplay._instanceMap.values();
        return Array.from(Display._instanceMap.values());
    }
    get element() {
        return this._element;
    }
    /**
     * returns the name/id of the display element.
     */
    get id() {
        return this._element.id;
    }
    /**
     *
     * @param text
     * @returns
     */
    displayText(text) {
        if (Util.isValidObject(text))
            this._element.innerText = text;
        return this;
    }
    addText(text) {
        this._element.textContent = this._element.textContent + text;
        return this;
    }
    clear() {
        this._element.innerText = "";
        return this;
    }
    get text() {
        return this._element.innerText;
    }
    set text(displayText) {
        this._element.innerText = displayText;
    }
    get kpKind() {
        return Kind.Display;
    }
    setClasses(classes) {
        Util.setClasses(this._element, classes);
        return this;
    }
    get isEmpty() {
        return (this == Display._emptyDisplay);
    }
    /** Returns an 'empty' Display instance. */
    get empty() {
        return Display._emptyDisplay;
    }
}
Display._instanceMap = new Map();
/** static constructor */
(() => {
    const emptyElement = document.createElement("div");
    emptyElement.id = "empty";
    Display._emptyDisplay = new Display(emptyElement);
})();
export { Display };
//# sourceMappingURL=display.js.map