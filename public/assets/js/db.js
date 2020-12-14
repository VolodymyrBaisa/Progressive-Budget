(function () {
    "use strict";

    //check for support
    if (!("indexedDB" in window)) {
        console.log("This browser doesn't support IndexedDB");
        return;
    }
})();

let db;

const openRequest = idb.open("budget", 1);
openRequest.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("pending", {
        keyPath: "id",
        autoIncrement: true,
    });
};
openRequest.onsuccess = function (e) {
    db = e.target.result;

    // if(navigator.onLine) addItem();
};
openRequest.onerror = function (e) {
    console.dir(e);
};
