import { Kind, createUniqueId } from './kp.js';
import { Util } from './util.js';
/**
 * kpContainer class instances describe container that contains keys or
 * other containers.
 * @see kp.container() to create or retrieve a container.
 */
class Container {
    /** Property is set to 'grid', 'flex' or 'none'. Used to properly display a popup container.
     * Only set when parent is popupkey otherwise undefined.'
     * @deprecated
     */
    get popupDisplay() {
        return this._popupDisplay;
    }
    set DisplayStyle(style) {
        if (style != "none")
            this._displayStyle = style;
    }
    get displayStyle() {
        return this._displayStyle;
    }
    constructor(key, element) {
        this._displayParam = [];
        this._kpKeys = [];
        this._childContainers = [];
        Container._instanceMap.set(key, this);
        this._element = element;
        this._element.kpObject = this;
        const parentElement = this._element.parentElement;
        if (Util.isValidObject(parentElement.kpObject)) {
            // if(Kind.isContainer(parentElement.kpObject))
            // {
            //     this._parentContainer = parentElement.kpObject as Container;
            //     this._parentContainer._childContainers.push(this);
            // }
            if (parentElement.kpObject.kpKind == Kind.Popup) {
                // this._popupContainer = this;
                // this._popupDisplay = window.getComputedStyle(this._element, null).display;
                // if(this._popupDisplay === "none") this._popupDisplay = "flex";
                // this._element.style.display = "none";
                this.fixPopupContainer(this);
            }
        }
        Util.addKpAttributeIfRequired(element, Kind.Container);
    }
    makeChildKeys() {
        this._element.childNodes.forEach(e => {
            // childnodes can contain text and comments so ignore them
            if (e instanceof HTMLDivElement) {
                //this._kpKeys.push( getKey(e));
            }
        });
    }
    static getInstance(e) {
        if (typeof e === "string") {
            const elementId = e;
            const instance = Container._instanceMap.get(elementId);
            if (instance != null) {
                return instance;
            }
            const element = document.getElementById(elementId);
            //todo: add error if elementID is not found
            //let t = typeof(element);
            if ((element != null) && (element.nodeName === "DIV")) {
                const container = new Container(elementId, element);
                //container._element.classList.contains()
                container.makeChildKeys();
                return container;
            }
        }
        else if (e instanceof HTMLElement) {
            const element = e;
            if (element.id != "") {
                const instance = Container._instanceMap.get(element.id);
                if (instance != null) {
                    return instance;
                }
            }
            //let element = document.getElementById(elementId);
            //todo: add error if elementID is not found
            //let t = typeof(element);
            if ((element != null) && (element.nodeName === "DIV")) {
                if (element.id == "")
                    element.id = createUniqueId("container");
                const container = new Container(element.id, element);
                //container._element.classList.contains()
                container.makeChildKeys();
                return container;
            }
        }
        return null;
    }
    /**
     * returns an array keypad keys (and containers?) that are in this container.
     * todo: verify child containers are included in kpKeys
     */
    get KpKeys() {
        // if(this._kpKeys.length == 0){
        //     // just incase keKeys was never initialized
        //     this.makeChildKeys();
        // }
        // todo: elements may have been added so regenerate the array, maybe
        return Array.from(this._kpKeys); // create copy of array so it is immutable
    }
    set keyHandler(fn) {
        this._keyHandler = fn;
    }
    get keyHandler() {
        return this._keyHandler;
    }
    /**
     * Returns true if the key is a child of this container.
     * @param key
     * @returns
     */
    isChild(key) {
        return this._kpKeys.includes(key);
    }
    /** Identifies this object as {@link Kind.Container} */
    get kpKind() {
        return Kind.Container;
    }
    get element() {
        return this._element;
    }
    setClasses(classes) {
        Util.setClasses(this._element, classes);
        this.DisplayStyle = this.getDisplayStyle();
        return this;
    }
    showOnly() {
        if (Util.isValidObject(this._displayStyle))
            this._element.style.display = this._displayStyle;
        else
            this._element.style.display = "grid";
    }
    getDisplayStyle() {
        return window.getComputedStyle(this._element, null).display;
    }
    hideOnly() {
        this.DisplayStyle = this.getDisplayStyle();
        this._element.style.display = "none";
    }
    get siblings() {
        return this._parentContainer.childContainers.
            filter(cont => cont != this);
    }
    /**
     * Shows this container and hides sibling containers.
     * */
    show() {
        this.showOnly();
        //let s = this.siblings;
        this.siblings.forEach(sib => { sib.hideOnly(); });
        return this;
    }
    hide() {
        this.hideOnly();
        return this;
    }
    get childContainers() {
        return Array.from(this._childContainers);
    }
    /** returns the parent container. Returns null if one doesn't exist.
     * Also see {@link Container.parentKey} */
    get parentContainer() {
        return this._parentContainer;
    }
    /** if defined indicates the container in the chain to be hidden since its
     * parent is a popup key.
    */
    get popupContainer() {
        return this._popupContainer;
    }
    /**
     * Returns the parent element provided it is a key, otherwise
     * null is returned.
     * Also see {@link Container.parentContainer} */
    get parentKey() {
        const parentElement = this._element.parentElement;
        // if(parentElement == null) return null;
        // if(parentElement.kpObject == undefined)return null;
        // if(!(parentElement.kpObject instanceof Key))return null;
        return parentElement.kpObject;
    }
    /**
     * Creates child kp object. Currently only creates a container.
     * @param childInfo
     * @param content Optional parameter only used when creating a dropDown key
     * @param target Optional parameter only used when creating a show key.
     * Content must be set to empty or null when this optional parameter is used.
     * @returns
     */
    // TODO: fix to use value and remove eslint-disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // createChild({id="", label="", value="", kind=Kind.Key, classes=[], target=null, child={}}:iKpKeyInfo):iKp{
    //     let returnObject:iKp = null;
    //     //childInfo = kp.Util.addDefaultKeyInfo(childInfo);
    //     if(kind == Kind.Key){
    //         const e = document.createElement("div");
    //         Util.setClasses(e, classes);
    //         e.appendChild(document.createTextNode(label));
    //         e.id = id;
    //         this.element.appendChild(e);
    //         const key = getKey(e);
    //         this._kpKeys.push( key);
    //         returnObject = key as Key;
    //     }
    //     else if(kind == Kind.Container){
    //         const e = document.createElement("div");
    //         e.id = id;
    //         e.setAttribute(dataAttribute.KP, Kind.GRID_CONTAINER);
    //         Util.setClasses(e, classes);
    //         this._element.appendChild(e);
    //         returnObject = getContainer(e);
    //         (returnObject as Container)._popupContainer = this._popupContainer;
    //     }
    //     else if(kind == Kind.Show){
    //         const e = document.createElement("div");
    //         e.id = id;
    //         e.innerHTML = label;
    //         e.setAttribute(dataAttribute.KP, Kind.SHOW);
    //         Util.setClasses(e, classes);
    //         this._element.appendChild(e);
    //         returnObject = Key.getInstance(e, target)
    //     }
    //     else if(kind == Kind.Popup){
    //         const e = document.createElement("div");
    //         e.id = id;
    //         e.innerHTML = label;
    //         e.setAttribute(dataAttribute.KP, Kind.POPUP);
    //         Util.setClasses(e, classes);
    //         this._element.appendChild(e);
    //         const eContent = document.createElement('div');
    //         Util.setClasses(eContent, child.classes);
    //         e.appendChild(eContent);
    //         const content = getContainer(eContent);
    //         // fix container because this is not done in the constructor 
    //         // because it relies on the kpKey being created first
    //         this.fixPopupContainer(content);
    //         returnObject = Key.getInstance(e, content);
    //         // set mouseover handler
    //     }
    //     return returnObject;
    // }
    /**
     * fix container because of special requirements of a popup Container.
     * Note: this is not always done in the constructor
     * because it relies on the kpKey being created first
     * @param content : ;
     */
    fixPopupContainer(content) {
        content._popupContainer = content;
        //content._popupDisplay = this.getDisplayStyle();
        //if(content._popupDisplay === "none") content._popupDisplay = "flex";
        const style = content.getDisplayStyle();
        if (style === "none")
            content.DisplayStyle = 'flex';
        else
            content.DisplayStyle = style;
        content._element.style.display = "none";
    }
    createChildren(childInfoArray) {
        const returnArray = [];
        // childInfoArray.forEach(key =>{
        //     returnArray.push(this.createChild(key));
        // })
        return returnArray;
    }
}
/**
 * Stores all instances of kpuiContainer
 */
Container._instanceMap = new Map();
Container._defaultClasses = ['kpContainer'];
export { Container };
//# sourceMappingURL=container.js.map