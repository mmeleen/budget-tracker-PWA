const request = window.indexedDB.open("budget", 1);
let db;

request.onupgradeneeded = function (e) {
  const dbEvent = e.target.result; //
  dbEvent.createObjectStore("pending", { autoIncrement: true }); //
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
  console.log("There was an error");
};

function saveRecord(record) {
  const transaction = db.transaction("pending", "readwrite"); // square brackets around pending if error
  store = transaction.objectStore("pending");
  store.add(record);
}

function checkIndexedDb() {
  const transaction = db.transaction("pending", "readwrite"); // square brackets around pending if error
  store = transaction.objectStore("pending");
  const items = store.getAll();
  items.onsuccess = function () {
    if (items.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(items.result),
        headers: {
          Accept: "application/json text/plain",
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(() => {
        const transaction = db.transaction("pending", "readwrite"); // square brackets around pending if error
        store = transaction.objectStore("pending");
        store.clear();
      })
    }
  }
}

request.onsuccess = function (e) {
  db = e.target.result;
  if (navigator.onLine) {
    checkIndexedDb;
  }
};

window.addEventListener("online", checkIndexedDb);