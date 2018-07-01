let From = document.getElementById('from');
let To = document.getElementById('to');
let input = document.getElementById('input');




const url = 'https://free.currencyconverterapi.com/api/v5/currencies';



fetch(url)
    .then(response => {
        if (response.status !== 200) {
            console.warn('Ooops!! There was a problem. Status code: ' + response.status);
            return
        }

        response.json().then(results => {
            for (const result in results) {
                for (const id in results[result]) {
                    const option = document.createElement('option');
                    option.value = results[result][id].id;

                    option.appendChild(document.createTextNode(`${results[result][id].currencyName} ${results[result][id].id}`));

                    From.appendChild(option);
                    To.appendChild(option.cloneNode(true));



                }
            }
            console.log(results)
        });

    })
    .catch(err => console.error('Fetch error', err));


document.getElementById('result').addEventListener('click', getConvert);



function getConvert(amount, from, to, cb) {
    from = From.value.split('').splice(0, 3).join('');
    to = To.value.split('').splice(0, 3).join('');
    amount = input.value;
    let query = `${from}_${to}`;
    console.log({ query })
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`)
        .then(response =>
            response.json()
        )
        .then(function (data) {
            console.log(data)
            let rate = data[query];
            console.log(data[query]);

            document.getElementById('result').value = Math.round(parseFloat(amount) * rate)
        })

}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../sw/sw.js', { scope: '/' })
        .then(function (registration) {
            console.log('service worker registered', registration)
        })
        .catch(function (err) {
           console.log('service worker failed to register!!!.', err)
        })
}
