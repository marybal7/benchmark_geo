// Initialize the map with Moscow coordinates
const map = L.map('map', {
    center: [0, 0], // Центрирование на экваторе
    zoom: 2,        // Уровень зума
    worldCopyJump: true // Карта продолжается горизонтально
});

// Добавление OpenStreetMap как подложки
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// GeoJSON слой для отображения точек
let geojsonLayer = L.geoJSON(null, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5,           // Размер точки
            fillColor: "blue", // Цвет заливки
            color: "white",       // Цвет обводки
            weight: 1,           // Толщина обводки
            opacity: 1,          // Прозрачность обводки
            fillOpacity: 1     // Прозрачность заливки
        });
    }
}).addTo(map);

// Функция обновления карты
function update(data) {
    geojsonLayer.addData(data); // Добавляем данные из GeoJSON в слой
}

let pageLoadTime

// Загрузка GeoJSON из файла
fetch("../world_coordinates.geojson")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Не удалось загрузить GeoJSON файл.");
        }
        return response.json();
    })
    .then((json) => {
        update(json); // Передача данных для обновления карты
        let now = new Date().getTime();
        pageLoadTime = now - performance.timing.navigationStart;
    })
    .catch((error) => {
        console.error("Ошибка загрузки GeoJSON:", error);
    });

window.leafletMap = map

