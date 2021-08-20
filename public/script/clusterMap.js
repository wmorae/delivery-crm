mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-49.2543026804924, -25.526644656553486],
    zoom: 12
});

map.on('load', () => {
    // Load an image from an external URL.
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


        }
    );
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('clusterPoints', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: clusterData,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 18 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'clusterPoints',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#03a9f4',
                10,
                '#2196f3',
                30,
                '#3f51b5'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10,
                15,
                30,
                15
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'clusterPoints',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'clusterPoints',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11d4fa',
            'circle-radius': 7,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#bababa'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('clusterPoints').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { htmlDescr } = e.features[0].properties

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        map.easeTo({
            center: coordinates,
            zoom: 16
        });

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(htmlDescr)
            .addTo(map);
    });
    const point = () => {
        map.getCanvas().style.cursor = 'pointer';
    }
    const unpoint = () => {
        map.getCanvas().style.cursor = '';
    }
    map.on('mouseenter', 'clusters', point);
    map.on('mouseleave', 'clusters', unpoint);
    map.on('mouseenter', 'unclustered-point', point);
    map.on('mouseleave', 'unclustered-point', unpoint);
});