type Invalid<T> = ['Needs to be all of', T];

const arrayOfAll =
    <T>() =>
    <U extends T[]>(
        ...array: U & ([T] extends [U[number]] ? unknown : Invalid<T>[])
    ) =>
        array;

export default arrayOfAll;
