import { createUniqueId, Kind } from "./kp.js";
import { Util } from "./util.js";
/**
 * Key instance represents a keypad UI key control.
 * Todo: add programatic creations of keys.
 * Todo: automatically create keys if elements contain the attribute data-kp='*key'.
 */
class Key {
    /**
     *  The container to be made visible when the show key is clicked or
     * when a popup key is clicked.
     */
    get target() {
        return this._target;
    }
    //private constructor(key:string, element: HTMLDivElement){
    constructor(element, kind, onClickHandler = null) {
        /** The container to be made visible when the show key is clicked or
         * when a popup key is clicked.
         */
        this._target = null;
        this._kpKind = Kind.Key;
        this._element = element;
        this._element.kpObject = this;
        let id = "";
        if (element.id === "") {
            id = Key.recommendedId(this.value);
            if (id === undefined)
                id = createUniqueId("key");
            element.id = id;
        }
        else
            id = element.id;
        //Key._instanceMap.set(id, this);
        //const c = this.value;
        if (onClickHandler == null)
            element.addEventListener("click", Key._defaultClickHandler);
        else
            element.addEventListener("click", onClickHandler);
        Util.addKpAttributeIfRequired(element, kind);
    }
    // static getInstance(elementId: string):Key;       //Overloaded signature
    // static getInstance(element: HTMLDivElement, target:Container):Key; //Overloaded signature
    // static getInstance(e:unknown, target:Container = null):iKp{
    //     if(typeof e === "string") {
    //         const elementId = e;
    //        // const instance = Key._instanceMap.get(elementId);
    //         const instance = document.getElementById(elementId);
    //         if (instance != null){
    //             return (instance as kpHTMLElement).kpObject;
    //         }
    //         e = document.getElementById(elementId);
    //         //todo: add error if elementID is not found
    //         // const t = typeof(element);
    //         // if((element != null) && (element.nodeName === "DIV")){
    //         //     const attr = element.getAttribute(kpui.data_attribute.kpui.description);
    //         //     const key = null;
    //         //     if(attr != null && attr === kpui.Kind.dropdownkey.description )
    //         //         key = new kpuiDropDownKey(element as HTMLDivElement);
    //         //     else key = new kpuiKey(element as HTMLDivElement);
    //         //     key.setClasses(kpuiKey._defaultClasses);
    //         //     return key;
    //         // }
    //         // return null;
    //     }
    //     //else 
    //     if(e instanceof HTMLElement){
    //         const id = e.id;
    //         let instance:iKp = Key._instanceMap.get(id);
    //         if (instance != undefined){
    //             return instance;
    //         }
    //         if((e != null) && (e.nodeName === "DIV")){
    //             const attr = e.getAttribute(dataAttribute.KP);
    //             if(attr != null && attr === Kind.SHOW ){
    //                 instance= new Key(e as kpHTMLElement, Kind.Show, Key._showClickHandler);
    //                 (instance as Key)._target = target;
    //                 (instance as Key)._kpKind = Kind.Show;
    //             }
    //             else if(attr != null && attr === Kind.POPUP ){
    //                 const keyPopup:Key = new Key(e as kpHTMLElement, Kind.Popup, Key._displayPopup);
    //                 keyPopup._kpKind = Kind.Popup;
    //                 if(keyPopup._target == null){
    //                     // create target, first check if there is a child element that is a container
    //                     let elementContainer = Util.getChildContainer(keyPopup._element)
    //                     // if no child, then create child container
    //                     if(elementContainer == null)elementContainer =Util.createChildContainerElement(keyPopup._element);
    //                     target = getContainer(elementContainer);
    //                 }
    //                 keyPopup._target = target;
    //                 keyPopup._element.onmouseleave = Key._hidePopup;
    //                 instance = keyPopup;
    //             }
    //             else instance = new Key(e as kpHTMLElement, Kind.Key);
    //             //instance.setClasses(kpKey._defaultClasses);
    //             instance.setClasses(Css.defaultKeyClasses);
    //             return instance;
    //         }
    //         throw new Error('bad things happened, should not happern');
    //     }
    //     else throw new Error('bad things happened, should not happern');
    // }
    /**
     * Returns the recommended Id for given key 'value.
     * For example for the value of '1' the string 'kpuiKey1' will be returned.
     * @param value The value of the key, for example '0', '1', '+', etc
     * @returns
     */
    static recommendedId(value) {
        return Key._keyMap.get(value);
    }
    /**
     * A convience method that sets the classes of the key element.
     * This method does not remove existing classes.
     * @param classes
     * @returns
     */
    setClasses(classes) {
        //this._element.className = "";
        // classes.forEach(cls =>{
        //     this._element.classList.add(cls)});
        Util.setClasses(this.element, classes);
        return this;
    }
    get element() {
        return this._element;
    }
    /**
     * Returns the value associated with this key.
     * For example the key for number 1 will return the string '1'.
     */
    get value() {
        return this.element.innerHTML;
    }
    get parentContainer() {
        const parentElement = this.element.parentElement;
        //TODO: fix so it uses kpObject, also check to insure parent is instanceof Container
        //return getContainer(parentElement.id);
        return null;
    }
    get kpKind() {
        return this._kpKind;
    }
    /**
     * Sets the key handler.
     */
    static set defaultKeyHandler(fn) {
        Key._defaultKeyHandler = fn;
    }
    /**
     * Gets the key handler.
     */
    static get defaultKeyHandler() {
        return Key._defaultKeyHandler;
    }
}
//private static _defaultClasses:Array<string> = ['kp-key', 'kp-key-style', 'kp-no-select'];
Key._defaultClickHandler = function (event) {
    const element = event.currentTarget;
    //const containerId = element.parentElement.id;
    //const container = kpui.container(containerId);
    //const key = kp.key(element.id) as kpKey;
    const key = element.kpObject;
    const container = key.parentContainer;
    if (container != null && container.keyHandler != null) {
        container.keyHandler(key);
    }
    else {
        const keyHandler = Key.defaultKeyHandler;
        if (keyHandler != null)
            keyHandler(key);
    }
    if (Util.isValidObject(container.popupContainer)) {
        container.popupContainer.element.style.display = 'none';
        event.stopPropagation();
    }
};
Key._showClickHandler = function (event) {
    const element = event.currentTarget;
    const key = element.kpObject;
    key._target.show();
};
Key._displayPopup = function (event) {
    const element = event.currentTarget;
    const key = element.kpObject;
    //key._target.element.style.display = "flex";
    //key._target.element.style.display = key._target.popupDisplay;
    key._target.element.style.display = key._target.displayStyle;
    // moves the dropdown content to the bottom of kpDornDownKey instance
    const rect = element.getBoundingClientRect();
    const off = element.offsetTop;
    //const style = window.getComputedStyle(element);
    //content.element.style.top = (rect.bottom).toString()+"px";
    key._target.element.style.top = (off + rect.height).toString() + "px";
    //content.element.style.right = rect.left.toString();
    // insure content stays on the window
    const ww = document.documentElement.clientWidth;
    const cr = key._target.element.getBoundingClientRect();
    if (cr.right > ww) // don't hide part of popup conatainer by displaying it right of the window
     {
        key._target.element.style.left = ((ww - cr.width)).toString() + "px";
    }
    else if (cr.left < 0) // don't hide part of popup container by displaying it left of the window
     {
        key._target.element.style.left = "0px";
    }
};
Key._hidePopup = function (event) {
    const element = event.currentTarget;
    const key = element.kpObject;
    key._target.element.style.display = "none";
};
Key._keyIds = {
    kpuiKeyPlus: "+",
    kpuiKeyMinus: "-",
    kpuiKeyMultiply: "×",
    kpuiKeyDivide: "÷",
    kpuiKey1: "1",
    kpuiKey2: "2",
    kpuiKeyCarriageReturn: "⏎",
    kpuiKeyBackSpace: "⌫",
    kpuiKeyEquals: "=",
    kpuiKeyDeconste: "␡",
    kpuiKeyLeftRoundBracket: "(",
    kpuiKeyRightRoundBracket: ")"
};
Key._keyMap = new Map();
/**
 * static constructor
 */
(() => {
    // initialize keyMap
    Object.keys(Key._keyIds).forEach(key => {
        Key._keyMap.set(Key._keyIds[key], key);
    });
})();
Key._defaultKeyHandler = null;
export { Key };
//# sourceMappingURL=key.js.map