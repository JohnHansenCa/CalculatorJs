import * as kp from "../KeyPadJs/src/scripts/kp.js"
import * as Mathjs from "./mathjs/mathjs.js"
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
/**
 * TODO: fix @see comment below
 * The function below will become the {@link kp.DefaultListner.key} 
 * Everytime a {@link Key} is clicked this function will be executed.
 * @param key 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keyHandler:kp.KeyListener = function(keyValue:string, e:HTMLElement):void{
    const _current = kp.Display.getInstance("key-bucket");
    if(_current != null) // TODO: get rid of statement when empty is added to Display
    {
        let char = keyValue;
        if(char === "\b" || char == "⌫")
        _current.displayText(_current.text.slice(0, -1));
        else if (char === "␡")
        _current.clear();
        else if (char === "to"){
          char = " "+ char + " ";
          _current.displayText(_current.text + char);
          addSpace=" ";
        }
        else if (char === "in"){
          char = " "+ char + " ";
          _current.displayText(_current.text + char);
          addSpace=" ";
        }
        else{
            
            _current.displayText(_current.text + addSpace + char);
            addSpace = "";
        }
    }
}
//https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
declare const math:Mathjs.MathJsStatic & special; 
const key_bucket = kp.Display.getInstance("key-bucket");
const calcDisplay = kp.Display.getInstance("calc-display")  ;
const statusDisplay = kp.Display.getInstance("calc-status");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculate(e:unknown){
    const _evaluateText = key_bucket.text.replaceAll("×","*").replaceAll("÷","/");
    //let result = math.evaluate(_evaluateText);
    //calcDisplay.displayText( result);
    
    if(_evaluateText == ""){
        calcDisplay.displayText("0");
        statusDisplay.displayText("status:okay");
    }
    else{
        try{
            const result = math.evaluate(_evaluateText).toString();
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
observer.observe (key_bucket.element, { attributes: false, childList: true, subtree:false } );
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