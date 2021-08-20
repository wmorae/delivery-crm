mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: mapdata.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(mapdata.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h6>Cliente</h6><p>Endereço do cliente</p>`
        )
    )
    .addTo(map)
map.loadImage(
    '/img/abba.webp',
    (error, image) => {
        if (error) throw error;

        // Add the image to the map style.
        map.addImage('abba', image);

        // Add a data source containing one point feature.
        map.addSource('point', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-49.2543026804924, -25.526644656553486]
                        }
                    }
                ]
            }
        });

        // Add a layer to use the image to represent the data.
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'point', // reference the data source
            'layout': {
                'icon-image': 'abba', // reference the image
                'icon-size': 0.13
            }
        });
    }
);

// new mapboxgl.Marker()
//     .setLngLat( [-49.2543026804924, -25.526644656553486])
//     .setPopup(
//         new mapboxgl.Popup({ offset: 25 }).setHTML(
//             `<h6>Cantina da abba 2</h6><p>Você deveria estar aqui!</p>`
//         )
//     )
//     .addTo(map)