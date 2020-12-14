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
    if (navigator.onLine) checkDatabase();
};
openRequest.onerror = function (e) {
    console.dir(e);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // access your pending object store
    const store = transaction.objectStore("pending");

    // add record to your store with add method.
    store.add(record);
}

function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    const transaction = db.transaction(
                        ["pending"],
                        "readwrite"
                    );

                    // access your pending object store
                    const store = transaction.objectStore("pending");

                    // clear all items in your store
                    store.clear();
                });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);
