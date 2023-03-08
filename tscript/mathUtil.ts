// (c) copyright 2023 - https://github.com/JohnHansenCa
// All rights reservered except as delinated below
// GNU Affero General Public License v3.0
import * as Mathjs from "./mathjs/mathjs"
interface baseUnit{
    dimensions: [];
    key: string; 
}
interface special {
    /** Gives access to built-in unit definitions. */
    Unit: {
        /** returns an object giving all the base units as properities in upper case strings, eg LENGTH, MASS, etc */
        BASE_UNITS: Record<string, baseUnit> ;
        /**  returns an object giving all the units as properities in mostly lower case strings, eg A, ampere, amperes, m, m2, meter, etc */
        UNITS: Record<string, Mathjs.UnitComponent["unit"]>;
    }
}
declare const math:Mathjs.MathJsStatic & special; 
function getMathBaseUnits():string[]{
    const baseUnits = math.Unit.BASE_UNITS;
    const keys = Object.keys(baseUnits);
    const baseUnitsStr = [];
    keys.forEach(a =>{baseUnitsStr.push(a)});
    return baseUnitsStr;
}
function getMathUnits(baseUnit:string):math.UnitComponent["unit"][]{
    if(baseUnit == null ||(!(typeof baseUnit === 'string' || (baseUnit as unknown) instanceof String))) {
        return null;
    }
    const units =  math.Unit.UNITS;
    const values = Object.values(units);
    const returnValuesStrs:math.UnitComponent["unit"][] = []; 
    values.forEach(v  => {
         if(v.base.key === baseUnit) returnValuesStrs.push(
            v);
     })
    return returnValuesStrs; 
}
export{ getMathBaseUnits, getMathUnits, baseUnit, special}