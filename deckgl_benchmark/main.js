async function initMap() {
    const deckGlMap = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                osm: {
                    type: 'raster',
                    tiles: [
                        'https://tile.openstreetmap.org/{z}/{x}/{y}.png' // Тайлы OpenStreetMap
                    ],
                    tileSize: 256
                }
            },
            layers: [
                {
                    id: 'osm',
                    type: 'raster',
                    source: 'osm',
                    minzoom: 0,
                    maxzoom: 19
                }
            ]
        },
        center: [0, 0], // Центр: Москва
        zoom: 1 // Начальный масштаб
    });

// Список точек и маркеров
    let points = [];
    let markers = [];

// Создаем Deck.gl слой для точек
    let scatterplotLayer = new deck.ScatterplotLayer({
        id: 'scatterplot-layer',
        data: points,
        pickable: true,
        radiusScale: 20,
        stroked: true,
        radiusMinPixels: 5,
        getPosition: d => d.coordinates,
        getFillColor: [0, 0, 255],
        getLineColor: [255, 255, 255],
        radiusMaxPixels: 50,
        lineWidthMinPixels: 1,

        getLineWidth: 50,
    });

    await new Promise(resolve => deckGlMap.on('load', resolve));

// Интеграция Deck.gl с MapLibre
    const deckOverlay = new deck.MapboxOverlay({
        layers: [scatterplotLayer]
    });
    deckGlMap.addControl(deckOverlay);
//
// // Функция для обновления слоя
    function updateLayer() {
        scatterplotLayer = scatterplotLayer.clone({
            data: points
        });
        deckOverlay.setProps({
            layers: [scatterplotLayer]
        });
    }

    // Загрузка GeoJSON
    function loadGeoJSON() {
        fetch('../world_coordinates.geojson')
            .then(response => response.json())
            .then(data => {
                const geojsonPoints = data.features.map(feature => ({
                    coordinates: feature.geometry.coordinates
                }));
                points = [...points, ...geojsonPoints];
                updateLayer();
            })
            .catch(error => console.error('Error loading GeoJSON:', error));
    }

    loadGeoJSON();
    window.deckGlMap = deckGlMap;


}

await initMap();
//
// // Функция для добавления точки и маркера
// function addPoint(lngLat) {
//     points.push({ coordinates: [lngLat.lng, lngLat.lat] });
//
//     const marker = document.createElement('div');
//     marker.style.cssText = `
//     width: 10px;
//     height: 10px;
//     background-color: red;
//     border-radius: 50%;
//     box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
//     cursor: pointer;
//   `;
//
//     const mapMarker = new maplibregl.Marker(marker)
//         .setLngLat([lngLat.lng, lngLat.lat])
//         .addTo(map);
//
//     markers.push({ marker: mapMarker, coordinates: [lngLat.lng, lngLat.lat] });
//     updateLayer();
// }
//
// // Очистка всех точек
// function clearAllPoints() {
//     points = [];
//     markers.forEach(m => m.marker.remove());
//     markers = [];
//     updateLayer();
// }

// Загрузка GeoJSON

// Загрузка GeoJSON при старте

// document.getElementById('addPointButton').addEventListener('click', () => {
//     const lng = parseFloat(document.getElementById('longitudeInput').value);
//     const lat = parseFloat(document.getElementById('latitudeInput').value);
//     if (isNaN(lng) || isNaN(lat)) {
//         alert('Invalid coordinates! Please enter numeric longitude and latitude.');
//         return;
//     }
//     addPoint({ lng, lat });
// });
//
// document.getElementById('clearAllButton').addEventListener('click', clearAllPoints);
//
// map.on('click', e => {
//     addPoint(e.lngLat);
// });