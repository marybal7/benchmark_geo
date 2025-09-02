// читаем карту
function fetchJSON(url) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        });
}

// инициализируем
async function initMap() {
    const json = await fetchJSON('../world_coordinates.geojson');

    const map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'osm-standard': {
                    type: 'raster',
                    tiles: [
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256
                }
            },
            layers: [
                {
                    id: 'osm-standard-layer',
                    type: 'raster',
                    source: 'osm-standard',
                    minzoom: 0,
                    maxzoom: 19
                }
            ]
        },
        center: [0, 0],
        zoom: 1
    });

    await new Promise(resolve => map.on('load', resolve));

    let now = new Date().getTime();
    let page_load_time = now - performance.timing.navigationStart;
    // console.log("User-perceived page loading time: " + page_load_time); // millisecond

    map.addSource('points', {
        type: 'geojson',
        data: json
    });

    map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points',
        paint: {
            'circle-radius': 6,
            'circle-color': 'blue',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
        }
    });

    window.mapLibreMap = map;
    window.pageLoadTime = page_load_time
}

await initMap();

