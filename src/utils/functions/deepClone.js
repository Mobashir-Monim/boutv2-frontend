export const deepClone = obj => {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}