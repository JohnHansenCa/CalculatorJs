// (c) copyright 2023 - https://github.com/JohnHansenCa
// All rights reservered except as delinated below
// GNU Affero General Public License v3.0

import * as kp from "../KeyPadJs/tscript/kp.js"
import * as Mathjs from "./mathjs/mathjs"
import { getMathBaseUnits, getMathUnits, baseUnit, special } from "./mathUtil.js";

class CalcItem{
    private _eqnString:string;
    private _time:number;
    private _calcString:string;
    private constructor(eqn:string, calc:string){
       this.update(eqn, calc);
    }
    public static create(eqn:string, calc:string):CalcItem{
        return new CalcItem(eqn, calc);
    }
    /**
     * Copy is used to create a true CalcItem after JSON.parse is used.
     * @param item 
     * @returns 
     */
    public static copy(item:CalcItem):CalcItem{
        const returnItem = new CalcItem(item._eqnString, item._calcString);
        returnItem._time = item._time;
        return returnItem;
    }
    public get eqn():string{
        return this._eqnString;
    }
    public update(eqn: string, calc:string){
        this._eqnString = eqn;
        this._calcString = calc;
        this._time = Date.now();
    }
    public get time(){
        return this._time;
    }
    public get calc(){
        return this._calcString;
    }
    public get ISOTime():string{
        return new Date(this._time).toISOString();
    }
    public get dateTime():string{
        return new Date(this._time).toString();
    }
}
class History{
    
    private static _currentCalcItem:CalcItem = null;
    private static historyList:CalcItem[] = [];
    private static lastCalc: CalcItem;
    static{
        const historyItem = localStorage.getItem("history");
        let list:CalcItem[];
        if(historyItem != null){
            list = JSON.parse(historyItem);
            list.forEach(item =>{
                History.historyList.push(CalcItem.copy(item))
            });
        }
        if(History.historyList.length > 0)  
        {
            const last = History.historyList.length - 1;
            History._currentCalcItem = History.historyList[last]
            History.lastCalc = History.historyList[last];
        }
    }
    static add(calcItem:CalcItem):void {
        if(calcItem != History.lastCalc)
            History.historyList.push(calcItem);
        History.lastCalc = calcItem;
        localStorage.setItem("history", JSON.stringify(History.historyList));
    }
    static get List(): CalcItem[]{
        return History.historyList;
    }
    static store(){
        if(History._currentCalcItem == null) {
            History._currentCalcItem = CalcItem.create(keyBucket.text, calcDisplay.text);
        }
        else History._currentCalcItem.update(keyBucket.text, calcDisplay.text);
        History.add(History._currentCalcItem);
    }
    static newCurrentItem(){
        History._currentCalcItem = null;
    }
    static clear(){
        History.historyList = [];
        History.historyList.push(History._currentCalcItem);
        localStorage.setItem("history", JSON.stringify(History.historyList));
        History._currentCalcItem = null;
    }
}



let addSpace="";
//https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types
declare const math:Mathjs.MathJsStatic & special; 
const keyBucket = kp.Display.getInstance("key-bucket");  
let isFirst = true;
const calcDisplay = kp.Display.getInstance("calc-display")  ;
const statusDisplay = kp.Display.getInstance("calc-status");
const jsReleaseMsg = "JS release 2023-03-09 0.11"
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
    //console.log(target);
}
document.getElementById("extra-keys-slider").onchange = function(event: Event){
    let target:HTMLInputElement = event.target as any;
    setNumberOfKeys(target);
    localStorage.setItem("extra-keys-slider", target.checked.toString());
    //console.log(target);
}
function setNumberOfKeys(target:HTMLInputElement){
    
    const containerRow = document.getElementById("keyContainerSingleby5Two");
    const containerColumn = document.getElementById("extra-keys-container");
    if(target.checked){
        // min keys
        containerColumn.style.display = "none";
        containerRow.style.display = "none";
    }
    else{
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
const _keyHandler:kp.KeyListener = function(keyValue:string, e:HTMLElement):void{
    //const keyBucket = kp.Display.getInstance("key-bucket");
    if(isFirst){
        isFirst = false;
        //keyBucket.clear();
    }
    if(keyBucket != null) // TODO: get rid of statement when empty is added to Display
    {
        let char = keyValue;
        if(char === "\b" || char == "⌫")
        keyBucket.displayText(keyBucket.text.slice(0, -1));
        else if (char === "␡"){
            keyBucket.clear();
            History.newCurrentItem();
        }
        else if(char === "⅟𝑥" && keyBucket.text != ""){
            keyBucket.displayText(`1/(${keyBucket.text})`)
        }
        else if(char === "𝑥²"){
            keyBucket.addText('^2')
        }
        else if(char === "𝑥ⁿ"){
            keyBucket.addText('^')
        }
        else if(char === "√𝑥"){
            keyBucket.displayText(`sqrt(${keyBucket.text})`)
        }
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
    const _evaluateText = keyBucket.text.replaceAll("×","*").replaceAll("÷","/").replaceAll("π", "pi");
    // const test = ("π").replaceAll("π", "pi"); 
    // console.log(test);
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
            localStorage.setItem("keyBucket", keyBucket.element.innerText); 
            History.store();
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
/**
 * *** Startup Code ***
 */
// display about message on start up
window.addEventListener("load", function(){
    const settingBtn = document.getElementById('settings-btn');
    document.getElementById('settings-btn').click();
    document.getElementById('about-btn').click();

    
    const stor = localStorage.getItem("keyBucket");
    keyBucket.displayText(localStorage.getItem("keyBucket"));
    calculate(null); // make sure zero is displayed

    const keySlider = this.document.getElementById("extra-keys-slider") as HTMLInputElement;
    keySlider.checked = (localStorage.getItem("extra-keys-slider") === 'true');
    setNumberOfKeys(keySlider);

    // *** initialize history div
    const clearHistoryBtn = this.document.getElementById("clear-history-btn");
    clearHistoryBtn.addEventListener("click", function(){
        History.clear();
    })
    const historyBtn = this.document.getElementById("history-btn");
    historyBtn.addEventListener("click", function(){
        const historyDiv = document.getElementById("history-content");
        historyDiv.innerHTML = "";
        History.List.forEach(item =>{
            let span = document.createElement("span");
            let button = document.createElement("button");
            span.append(`${item.ISOTime}:`);
            button.innerHTML = `${item.eqn}`;
            button.addEventListener("click", function(event:Event){
                History.newCurrentItem();
                const element = event.target as HTMLElement;
                keyBucket.displayText(element.innerText);
            })
            span.appendChild(button);
            span.append(`=${item.calc}`)
            historyDiv.appendChild(span);
        })
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
const baseUnits:string[]=getMathBaseUnits();
console.log(baseUnits);
const units = getMathUnits(baseUnits[2]);
//console.log(units);