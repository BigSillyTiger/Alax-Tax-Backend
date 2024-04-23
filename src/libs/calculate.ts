import Big from "big.js";

export const timesAB = (x: number, y: number): number => {
    const a = new Big(x);
    const b = new Big(y);
    return a.times(b).toNumber();
};

export const divAB = (x: number, y: number): number => {
    const a = new Big(x);
    const b = new Big(y);
    Big.DP = 2;
    return a.div(b).toNumber();
};

export const minusAB = (x: number, y: number): number => {
    const a = new Big(x);
    const b = new Big(y);
    return a.minus(b).toNumber();
};

export const plusAB = (x: number, y: number): number => {
    const a = new Big(x);
    const b = new Big(y);
    return a.plus(b).toNumber();
};
