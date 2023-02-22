function getMathBaseUnits() {
    const baseUnits = math.Unit.BASE_UNITS;
    const keys = Object.keys(baseUnits);
    const baseUnitsStr = [];
    keys.forEach(a => { baseUnitsStr.push(a); });
    return baseUnitsStr;
}
function getMathUnits(baseUnit) {
    if (baseUnit == null || (!(typeof baseUnit === 'string' || baseUnit instanceof String))) {
        return null;
    }
    const units = math.Unit.UNITS;
    const values = Object.values(units);
    const returnValuesStrs = [];
    values.forEach(v => {
        if (v.base.key === baseUnit)
            returnValuesStrs.push(v);
    });
    return returnValuesStrs;
}
export { getMathBaseUnits, getMathUnits };
//# sourceMappingURL=mathUtil.js.map