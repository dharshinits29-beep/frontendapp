const DB_NAME = "userDB";
const STORE_NAME = "users";
const DB_VERSION = 2;

export const openDBInstance = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }

      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });

      store.createIndex("username","username", { unique: true });
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) =>
      reject(`DB error: ${event.target.errorCode}`);
  });
};

export const addUser = async (userData) => {
  const db = await openDBInstance();
  const { id, ...cleanUserData } = userData;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(cleanUserData);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => {
      reject("Failed to add user");
    };
  });
};

export const getUserByUsername = async (username) => {
  const db = await openDBInstance();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const users = store.getAll();

    users.onsuccess = (e) => {
      const found = e.target.result.find((u) => u.username === username);
      resolve(found);
    };

    users.onerror = () => reject("Failed to find user");
  });
};
