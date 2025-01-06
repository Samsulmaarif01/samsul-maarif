function initMap() {
    // Koordinat lokasi kantor (ganti sesuai lokasi yang diinginkan)
    const officeLocation = { lat: -6.200000, lng: 106.816666 }; // Contoh: Jakarta

    // Membuat peta
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: officeLocation,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -80}]
            }
        ]
    });

    // Menambahkan marker
    const marker = new google.maps.Marker({
        position: officeLocation,
        map: map,
        title: 'Lokasi Kantor Kami',
        animation: google.maps.Animation.DROP
    });

    // Info window untuk marker
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-4">
                <h3 class="font-bold">Kantor Desain</h3>
                <p>Jl. Contoh No. 123</p>
                <p>Jakarta, Indonesia</p>
            </div>
        `
    });

    // Event listener untuk marker
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}