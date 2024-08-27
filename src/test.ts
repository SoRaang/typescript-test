// [1, 2, 3].myForEach((v, i, a) => {
//     console.log(v, i, a);
// });

// [1, 2, 3].myForEach((v, i) => {
//     console.log(v);
// });

// [1, 2, 3].myForEach((v) => 3);

// ['1', '2', '3'].myForEach((v) => {
//     console.log(v.slice(0));
// });

// [true, 2, '3'].myForEach((v) => {
//     if (typeof v === 'string') {
//         v.slice(0);
//     } else {
//         v.toFixed();
//     }
// });

[1, 2, 3].myForEach(function() {
    console.log(this);
}, {a: 'b'});

interface Array <T> {
    myForEach <K = Window> (callback: (this: K, v: T, i: number, a: T[]) => void, thisArg?: K): void;
}