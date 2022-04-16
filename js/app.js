$(document).ready(function () {
    $('#nav-item').click(function () {
        $('#nav-item').toggleClass('active');
    })

    let _urlData = `https://my-json-server.typicode.com/sahrulprograming/mockaroo1/blogs`;
    let dataResult = '';
    let judulResult = '';
    let judul = [];

    function renderPage(data) {
        $.each(data, function (key, items) {
            _judul = items.judul;
            _isi = items.description;
            dataResult += `<div class="col mb-3 blog">
                            <a class="nav-link" href="detail.html">
                            <div class="card sekilas-blog text-dark">
                                <img src="img/` + items.img + `" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">` + _judul + `</h5>
                                    <p class="card-text">` + _isi.substring(0, 100) + `</p>
                                </div>
                            </div>
                            </a>
                        </div>`
        });
        $('.daftar-blog').html(dataResult);
    };
    var networkDataReceived = false;
    var networkUpdate = fetch(_urlData).then(function (response) {
        return response.json();
    }).then(function (data) {
        networkDataReceived = true;
        renderPage(data);
    });

    caches.match(_urlData).then(function (response) {
        if (!response) throw Error('no data');
        return response.json();
    }).then(function (data) {
        if (!networkDataReceived) {
            renderPage(data);
            console.log('render page from cache');
        }
    }).catch(function () {
        return networkUpdate;
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function (registration) {
                console.log('Registration successful, scope is:', registration.scope);
            })
            .catch(function (error) {
                console.log('Service worker registration failed, error:', error);
            });
    }

    let deferredPrompt;
    var divBtnAdd = document.querySelector('#add-to');
    var btnAdd = document.querySelector('.add-home');

    divBtnAdd.style.display = 'none';

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can add to home screen

        divBtnAdd.style.display = 'block';

        $('.add-home').on('click', (e) => {
            // hide our user interface that shows our A2HS button
            divBtnAdd.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice
                .then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
        });
    });
})