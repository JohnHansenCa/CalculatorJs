// (c) copyright 2023 - https://github.com/JohnHansenCa
// All rights reservered except as delinated below
// GNU Affero General Public License v3.0
import * as kp from "../KeyPadJs/tscript/kp.js";
import { getMathBaseUnits, getMathUnits } from "./mathUtil.js";
class CalcItem {
    constructor(eqn, calc) {
        this.update(eqn, calc);
    }
    static create(eqn, calc) {
        return new CalcItem(eqn, calc);
    }
    /**
     * Copy is used to create a true CalcItem after JSON.parse is used.
     * @param item
     * @returns
     */
    static copy(item) {
        const returnItem = new CalcItem(item._eqnString, item._calcString);
        returnItem._time = item._time;
        return returnItem;
    }
    get eqn() {
        return this._eqnString;
    }
    update(eqn, calc) {
        this._eqnString = eqn;
        this._calcString = calc;
        this._time = Date.now();
    }
    get time() {
        return this._time;
    }
    get calc() {
        return this._calcString;
    }
    get ISOTime() {
        return new Date(this._time).toISOString();
    }
    get customTime() {
        const d = new Date(this._time);
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        const hr = new Intl.DateTimeFormat('fr', { hour: 'numeric' }).format(d).substring(0, 2); // first 2 digits only
        let mn = new Intl.DateTimeFormat('en', { minute: 'numeric' }).format(d);
        if (mn.length == 1)
            mn = "0" + mn;
        let ss = new Intl.DateTimeFormat('en', { second: 'numeric' }).format(d);
        if (ss.length == 1)
            ss = "0" + ss;
        const zz = new Intl.DateTimeFormat("sv", { timeZoneName: "short" }).format(d).split(' ')[1];
        //const zz = new Intl.DateTimeFormat("en",{timeZone:""}).format(d);
        return `${ye}-${mo}-${da} ${hr}:${mn}:${ss}(${zz})`;
    }
    get dateTime() {
        return new Date(this._time).toString();
    }
}
class History {
    static add(calcItem) {
        if (calcItem != History.lastCalc)
            History.historyList.push(calcItem);
        History.lastCalc = calcItem;
        localStorage.setItem("history", JSON.stringify(History.historyList));
    }
    static get List() {
        return History.historyList;
    }
    static store() {
        if (History._currentCalcItem == null) {
            History._currentCalcItem = CalcItem.create(keyBucket.text, calcDisplay.text);
        }
        else
            History._currentCalcItem.update(keyBucket.text, calcDisplay.text);
        History.add(History._currentCalcItem);
    }
    static newCurrentItem() {
        History._currentCalcItem = null;
    }
    static get currentItem() {
        return History._currentCalcItem;
    }
    static clear() {
        History.historyList = [];
        if (kp.Util.isValidObject(History._currentCalcItem))
            History.historyList.push(History._currentCalcItem);
        localStorage.setItem("history", JSON.stringify(History.historyList));
        History._currentCalcItem = null;
    }
}
History._currentCalcItem = null;
History.historyList = [];
(() => {
    const historyItem = localStorage.getItem("history");
    let list;
    if (historyItem != null) {
        list = JSON.parse(historyItem);
        list.forEach(item => {
            History.historyList.push(CalcItem.copy(item));
        });
    }
    if (History.historyList.length > 0) {
        const last = History.historyList.length - 1;
        History._currentCalcItem = History.historyList[last];
        History.lastCalc = History.historyList[last];
    }
})();
let addSpace = "";
const keyBucket = kp.Display.getInstance("key-bucket");
let isFirst = true;
const calcDisplay = kp.Display.getInstance("calc-display");
const statusDisplay = kp.Display.getInstance("calc-status");
const jsReleaseMsg = "JS release 2023-03-15 0.13";
//keyBucket.displayText(jsReleaseMsg);
document.getElementById("javascript-version").innerText = jsReleaseMsg;
document.getElementById("dark-light-slider").onchange = function (event) {
    let target = event.target;
    const container = document.getElementById("calculator-container");
    if (target.checked) {
        // dark
        container.classList.remove("kp-light");
        container.classList.add("kp-dark");
        document.body.style.backgroundColor = "black";
    }
    else {
        // light
        container.classList.remove("kp-dark");
        container.classList.add("kp-light");
        document.body.style.backgroundColor = "white";
    }
    //console.log(target);
};
document.getElementById("extra-keys-slider").onchange = function (event) {
    let target = event.target;
    setNumberOfKeys(target);
    localStorage.setItem("extra-keys-slider", target.checked.toString());
    //console.log(target);
};
function setNumberOfKeys(target) {
    const containerRow = document.getElementById("keyContainerSingleby5Two");
    const containerColumn = document.getElementById("extra-keys-container");
    if (target.checked) {
        // min keys
        containerColumn.style.display = "none";
        containerRow.style.display = "none";
    }
    else {
        // max keys
        containerColumn.style.display = "";
        containerRow.style.display = "";
    }
}
/**
 * TODO: fix @see comment below
 * The function below will become the {@link kp.DefaultListner.key}
 * Everytime a {@link Key} is clicked this function will be executed.
 * @param key
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keyHandler = function (keyValue, e) {
    //const keyBucket = kp.Display.getInstance("key-bucket");
    if (isFirst) {
        isFirst = false;
        //keyBucket.clear();
    }
    if (keyBucket != null) // TODO: get rid of statement when empty is added to Display
     {
        let char = keyValue;
        if (char === "\b" || char == "⌫")
            keyBucket.displayText(keyBucket.text.slice(0, -1));
        else if (char === "⏎" || char === "\r") {
            if (keyBucket.text != "") {
                keyBucket.clear();
                History.newCurrentItem();
            }
        }
        else if (char === "⅟𝑥" && keyBucket.text != "") {
            keyBucket.displayText(`1/(${keyBucket.text})`);
        }
        else if (char === "𝑥²") {
            keyBucket.addText('^2');
        }
        else if (char === "𝑥ⁿ") {
            keyBucket.addText('^');
        }
        else if (char === "√𝑥") {
            keyBucket.displayText(`sqrt(${keyBucket.text})`);
        }
        else if (char === "to") {
            char = " " + char + " ";
            keyBucket.displayText(keyBucket.text + char);
            addSpace = " ";
        }
        else if (char === "in") {
            char = " " + char + " ";
            keyBucket.displayText(keyBucket.text + char);
            addSpace = " ";
        }
        else {
            keyBucket.displayText(keyBucket.text + addSpace + char);
            addSpace = "";
        }
        processKey(char);
    }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculate(e) {
    let _evaluateText = keyBucket.text.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("π", "pi");
    if (_evaluateText.search("\n") > -1) {
        //keyBucket.text = keyBucket.text.replaceAll("\n","");
        keyBucket.clear();
        History.newCurrentItem();
        return;
    }
    // const test = ("π").replaceAll("π", "pi"); 
    // console.log(test);
    //let result = math.evaluate(_evaluateText);
    //calcDisplay.displayText( result);
    if (_evaluateText == "") {
        calcDisplay.displayText("0");
        statusDisplay.displayText("status:okay");
    }
    else {
        try {
            let result = math.evaluate(_evaluateText);
            result = math.format(result, { precision: 14 }); // get rid of ugly numbers like 12.0000000000001
            calcDisplay.displayText(result);
            statusDisplay.displayText("status:okay");
            localStorage.setItem("keyBucket", keyBucket.element.innerText);
            History.store();
        }
        catch (err) {
            if (!calcDisplay.isEmpty)
                statusDisplay.displayText(err.message);
            else
                throw err;
        }
    }
}
function processKey(key) {
    if (key === ")" && (statusDisplay.text.startsWith("Unexpected") || statusDisplay.text.startsWith("status:okay"))) {
        keyBucket.text = "(" + keyBucket.text;
    }
}
kp.DefaultListner.key = _keyHandler;
//key_bucket.element.addEventListener('DOMSubtreeModified', calculate);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const observer = new MutationObserver((mutationlist, observ) => { calculate(observ); });
observer.observe(keyBucket.element, { attributes: true, childList: true, subtree: true, characterData: true });
/**
 * *** Startup Code ***
 */
window.addEventListener("load", function () {
    // display about message on start up
    const settingBtn = document.getElementById('settings-btn');
    document.getElementById('settings-btn').click();
    document.getElementById('about-btn').click();
    // get keyboard input
    keyBucket.element.onkeyup = function (event) {
        const key = event.key;
        processKey(key);
    };
    const stor = localStorage.getItem("keyBucket");
    keyBucket.displayText(localStorage.getItem("keyBucket"));
    calculate(null); // make sure zero is displayed
    const keySlider = this.document.getElementById("extra-keys-slider");
    keySlider.checked = (localStorage.getItem("extra-keys-slider") === 'true');
    setNumberOfKeys(keySlider);
    // *** initialize history div
    const clearHistoryBtn = this.document.getElementById("clear-history-btn");
    clearHistoryBtn.addEventListener("click", function () {
        History.clear();
    });
    const historyBtn = this.document.getElementById("history-btn");
    historyBtn.addEventListener("click", function () {
        const historyDiv = document.getElementById("history-content");
        historyDiv.innerHTML = "";
        History.List.forEach(item => {
            let span = document.createElement("span");
            let button = document.createElement("button");
            span.append(`${item.customTime}:`);
            span.appendChild(document.createElement("br"));
            button.innerHTML = `${item.eqn}`;
            button.addEventListener("click", function (event) {
                History.newCurrentItem();
                const element = event.target;
                keyBucket.displayText(element.innerText);
            });
            span.appendChild(button);
            span.append(`=${item.calc}`);
            historyDiv.appendChild(span);
            const br = document.createElement("br");
            historyDiv.appendChild(br);
        });
    });
    document.body.style.display = "";
});
//
// var myElement = document.createElement("div");
// myElement.innerText = "hello world";
// var observer2 = new MutationObserver(function(mutations) {
//          console.log("It's in the DOM!");
//          observer2.disconnect();
//  });
//  let body = document.getElementsByTagName('body')[0];
//  observer2.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
//  body.append(myElement);
const baseUnits = getMathBaseUnits();
console.log(baseUnits);
const units = getMathUnits(baseUnits[2]);
//console.log(units);
//# sourceMappingURL=calc.js.map