import "./main.js"

function benchmarkResult(pageLoadTime, fps, moveTime) {
    let coefPageLoad = 3
    let coefFps = 4
    let coefMoveTime = 3

    let perfomanceScore = coefPageLoad * (1 / pageLoadTime) + coefFps * fps + coefMoveTime * (1 / moveTime)
    console.log(perfomanceScore)

    return perfomanceScore
}

function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

// count fps
let fps = []
let frameCount = function _fc(time) {
    if (time - start_time > 30000) {
        // console.log(median(fps))
        return;
    }

    let now = performance.now();
    let duration = now - time;

    if(duration < 1000){
        _fc.counter++;
    } else {
        _fc.fps = _fc.counter;
        _fc.counter = 0;
        time = now;
        fps.push(_fc.fps)
    }
    requestAnimationFrame(() => frameCount(time));
}

frameCount.counter = 0;
frameCount.fps = 0;

let start_time = performance.now();
frameCount(start_time)



let mapLibreActions = [
    { type: 'zoom', value: 4 },
    { type: 'zoom', value: 2 },
    { type: 'pan', value: [37.6173, 55.7558] }, // Москва
    { type: 'pan', value: [0, 0] },
    { type: 'zoom', value: 3 },
    { type: 'zoom', value: 1 },
    { type: 'pan', value: [-74.006, 40.7128] }, // Нью-Йорк
    { type: 'pan', value: [139.6917, 35.6895] }, // Токио
    { type: 'zoom', value: 5 },
    { type: 'zoom', value: 2 },
    { type: 'pan', value: [2.3522, 48.8566] }, // Париж
    { type: 'pan', value: [151.2093, -33.8688] }, // Сидней
    { type: 'zoom', value: 6 },
    { type: 'zoom', value: 1 }
];

let mapLibreIndex = 0;
let start, end;
let move_time = []

let mapLibreInterval = setInterval(() => {

    if (mapLibreIndex >= mapLibreActions.length) {
        mapLibreIndex = 0;
        return
    }

    const action = mapLibreActions[mapLibreIndex];

    const onMoveStart = () => {
        start = performance.now();
    };

    const onMoveEnd = () => {
        end = performance.now();
        const duration = end - start;

        move_time.push(duration)
        // console.log(`${action.type} ${action.value}: ${duration.toFixed(2)}ms`);

        mapLibreMap.off('movestart', onMoveStart);  // Убираем слушатели
        mapLibreMap.off('moveend', onMoveEnd);
    };

    mapLibreMap.on('movestart', onMoveStart);

    if (action.type === 'zoom') {
        mapLibreMap.zoomTo(action.value);
    } else if (action.type === 'pan') {
        mapLibreMap.easeTo({ center: action.value });
    }

    mapLibreMap.on('moveend', onMoveEnd);

    mapLibreIndex++;
}, 1000)

setTimeout(() => {
    clearInterval(mapLibreInterval);
    // console.log(median(move_time))
}, 20000);


setTimeout(() => {
    console.log("page load time ", window.pageLoadTime)
    console.log("move time ", median(move_time))
    console.log("fps", median(fps))


    var elem = document.getElementsByClassName("popup")
    elem[0].style.opacity = 100

    let score = benchmarkResult(window.pageLoadTime / 1000, median(fps), median(move_time) / 1000)

    var result = document.getElementsByClassName("result")
    result[0].innerHTML = "Результат: " + Math.round(score) + " баллов"

}, 30000)

