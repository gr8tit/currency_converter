function openDatabase() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      return Promise.resolve();
    }
const dbPromise = idb.open('currency_converter', 1, upgradeDb => {
    console.log('making a new object store');
    let converterStore = upgradeDb.createObjectStore('converter', { keyPath: 'id' });
  store.createIndex('by-date', 'time')
  });
}
export default function IndexController(container) {
    this._container = container;
    this._dbPromise = openDatabase();
    this._registerServiceWorker();
  

}
IndexController.prototype._registerServiceWorker = function() {
    if (!navigator.serviceWorker) return;
  
    var indexController = this;
  
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      if (!navigator.serviceWorker.controller) {
        return;
      }
  
      if (reg.waiting) {
        indexController._updateReady(reg.waiting);
        return;
      }
  
      if (reg.installing) {
        indexController._trackInstalling(reg.installing);
        return;
      }
  
      reg.addEventListener('updatefound', function() {
        indexController._trackInstalling(reg.installing);
      });
    });
  
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  };

const Url = 'https://free.currencyconverterapi.com/api/v5/currencies';
fetch(Url)
    .then(response =>
        response.json()
    )
    .then(data => {
        dbPromise.then(db => {

            if (!db) return;

            currencies = [data.results];

            const transaction = db.transaction('converter', 'readwrite');
            const converterStore = transaction.objectStore('converter');

            currencies.forEach(currency => {
                for (let value in currency) {
                    converterStore.put(currency[value]);
                }
            });

            return transaction.complete;

        });
    });