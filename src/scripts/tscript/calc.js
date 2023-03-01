// (c) copyright 2023 - https://github.com/JohnHansenCa
// All rights reservered except as delinated below
// GNU Affero General Public License v3.0
//import * as kp from "/root//src/scripts/kp.js" 
//import * as kp from "../../KeyPadJs/src/scripts/kp.js"
import * as kp from "../KeyPadJs/tscript/kp.js";
import { getMathBaseUnits, getMathUnits } from "./mathUtil.js";
// interface baseUnit{
//     dimensions: [];
//     key: string;
// }
// interface special {
//     /** Gives access to built-in unit definitions. */
//     Unit: {
//         /** returns an object giving all the base units as properities in upper case strings, eg LENGTH, MASS, etc */
//         BASE_UNITS: Record<string, baseUnit> ;
//         /**  returns an object giving all the units as properities in mostly lower case strings, eg A, ampere, amperes, m, m2, meter, etc */
//         UNITS: Record<string, Mathjs.UnitComponent>;
//     }
// }
let addSpace = "";
const keyBucket = kp.Display.getInstance("key-bucket");
let isFirst = true;
const calcDisplay = kp.Display.getInstance("calc-display");
const statusDisplay = kp.Display.getInstance("calc-status");
const jsReleaseMsg = "JS release 2023-03-01 0.9";
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
        else if (char === "␡")
            keyBucket.clear();
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
    }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculate(e) {
    const _evaluateText = keyBucket.text.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("π", "pi");
    // const test = ("π").replaceAll("π", "pi"); 
    // console.log(test);
    //let result = math.evaluate(_evaluateText);
    //calcDisplay.displayText( result);
    localStorage.setItem("keyBucket", keyBucket.element.innerText);
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
        }
        catch (err) {
            if (!calcDisplay.isEmpty)
                statusDisplay.displayText(err.message);
            else
                throw err;
        }
    }
}
kp.DefaultListner.key = _keyHandler;
//key_bucket.element.addEventListener('DOMSubtreeModified', calculate);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const observer = new MutationObserver((mutationlist, observ) => { calculate(observ); });
observer.observe(keyBucket.element, { attributes: true, childList: true, subtree: true, characterData: true });
// display about message on start up
window.addEventListener("load", function () {
    const settingBtn = document.getElementById('settings-btn');
    document.getElementById('settings-btn').click();
    document.getElementById('about-btn').click();
    const stor = localStorage.getItem("keyBucket");
    keyBucket.displayText(localStorage.getItem("keyBucket"));
    calculate(null); // make sure zero is displayed
    const keySlider = this.document.getElementById("extra-keys-slider");
    keySlider.checked = (localStorage.getItem("extra-keys-slider") === 'true');
    setNumberOfKeys(keySlider);
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