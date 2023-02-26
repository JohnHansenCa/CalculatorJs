//import * as kp from "/root//src/scripts/kp.js" 
//import * as kp from "../../KeyPadJs/src/scripts/kp.js"
import * as kp from "../KeyPadJs/tscript/kp.js"
//import * as kp from "kpad/kp.js"
//import * as kp from "../KeyPadJs/src/scripts/kp.js"
import * as Mathjs from "./mathjs/mathjs"
import { getMathBaseUnits, getMathUnits, baseUnit, special } from "./mathUtil.js";
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
let addSpace="";
//https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
declare const math:Mathjs.MathJsStatic & special; 
const keyBucket = kp.Display.getInstance("key-bucket");  
let isFirst = true;
const calcDisplay = kp.Display.getInstance("calc-display")  ;
const statusDisplay = kp.Display.getInstance("calc-status");
const jsReleaseMsg = "JS release 2023-02-26 0.4"
//keyBucket.displayText(jsReleaseMsg);
document.getElementById("javascript-version").innerText = jsReleaseMsg;
document.getElementById("dark-light-slider").onchange = function(event: Event){
    let target:HTMLInputElement = event.target as any;
    const container = document.getElementById("calculator-container");
    if(target.checked){
        // dark
        container.classList.remove("kp-light");
        container.classList.add("kp-dark");
        document.body.style.backgroundColor = "black";
    }
    else{
        // light
        container.classList.remove("kp-dark");
        container.classList.add("kp-light");
        document.body.style.backgroundColor = "white";
    }
    console.log(target);
}
/**
 * TODO: fix @see comment below
 * The function below will become the {@link kp.DefaultListner.key} 
 * Everytime a {@link Key} is clicked this function will be executed.
 * @param key 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keyHandler:kp.KeyListener = function(keyValue:string, e:HTMLElement):void{
    //const keyBucket = kp.Display.getInstance("key-bucket");
    if(isFirst){
        isFirst = false;
        keyBucket.clear();
    }
    if(keyBucket != null) // TODO: get rid of statement when empty is added to Display
    {
        let char = keyValue;
        if(char === "\b" || char == "⌫")
        keyBucket.displayText(keyBucket.text.slice(0, -1));
        else if (char === "␡")
        keyBucket.clear();
        else if (char === "to"){
          char = " "+ char + " ";
          keyBucket.displayText(keyBucket.text + char);
          addSpace=" ";
        }
        else if (char === "in"){
          char = " "+ char + " ";
          keyBucket.displayText(keyBucket.text + char);
          addSpace=" ";
        }
        else{
            
            keyBucket.displayText(keyBucket.text + addSpace + char);
            addSpace = "";
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculate(e:unknown){
    const _evaluateText = keyBucket.text.replaceAll("×","*").replaceAll("÷","/");
    //let result = math.evaluate(_evaluateText);
    //calcDisplay.displayText( result);
    
    if(_evaluateText == ""){
        calcDisplay.displayText("0");
        statusDisplay.displayText("status:okay");
    }
    else{
        try{
            let result = math.evaluate(_evaluateText);
            result = math.format(result, {precision: 14}); // get rid of ugly numbers like 12.0000000000001
            calcDisplay.displayText(result);
            
            statusDisplay.displayText("status:okay");
        }
        catch(err){
            if(!calcDisplay.isEmpty)
                statusDisplay.displayText(err.message);
            else
                throw err;
        }
    }
 }
kp.DefaultListner.key = _keyHandler;
//key_bucket.element.addEventListener('DOMSubtreeModified', calculate);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const observer = new MutationObserver((mutationlist, observ)=>{ calculate(observ)});
observer.observe (keyBucket.element, { attributes: true, childList: true, subtree:true, characterData:true} );
// display about message on start up
window.addEventListener("load", function(){
    const settingBtn = document.getElementById('settings-btn');
    document.getElementById('settings-btn').click();
    document.getElementById('about-btn').click();
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
const baseUnits:string[]=getMathBaseUnits();
console.log(baseUnits);
const units = getMathUnits(baseUnits[2]);
//console.log(units);