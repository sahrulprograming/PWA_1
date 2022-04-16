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
})