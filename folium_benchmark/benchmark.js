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


const body = document.body
body.onload = onLoad
let pageLoadTime
function onLoad() {
    let now = new Date().getTime();
    pageLoadTime = now - performance.timing.navigationStart;
    // console.log("User-perceived page loading time: " + page_load_time); // millisecond
}

let foliumMap

let checkMap = setInterval(function () {
    if (typeof window.map_37c095e4a228c2f6d6c35afd28868809 !== "undefined") {
        clearInterval(checkMap);
        // Останавливаем проверку
        foliumMap = window.map_37c095e4a228c2f6d6c35afd28868809// Карта найдена



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


        let foliumActions = [
            { type: 'zoom', value: 4 },
            { type: 'zoom', value: 2 },
            { type: 'pan', value: [55.7558, 37.6173] },  // Москва
            { type: 'pan', value: [0, 0] },  // Экватор
            { type: 'zoom', value: 3 },
            { type: 'zoom', value: 1 },
            { type: 'pan', value: [40.7128, -74.006] },  // Нью-Йорк
            { type: 'pan', value: [35.6895, 139.6917] },  // Токио
            { type: 'zoom', value: 5 },
            { type: 'zoom', value: 2 },
            { type: 'pan', value: [48.8566, 2.3522] },  // Париж
            { type: 'pan', value: [-33.8688, 151.2093] },  // Сидней
            { type: 'zoom', value: 6 },
            { type: 'zoom', value: 1 }
        ];


        let foliumIndex = 0;
        let start, end;
        let move_time = []

        let foliumInterval = setInterval(() => {

            if (foliumIndex >= foliumActions.length) {
                foliumIndex = 0;
                return
            }

            const action = foliumActions[foliumIndex];

            const onMoveStart = () => {
                start = performance.now();
            };

            const onMoveEnd = () => {
                end = performance.now();
                const duration = end - start;

                move_time.push(duration)
                // console.log(`${action.type} ${action.value}: ${duration.toFixed(2)}ms`);

                foliumMap.off('movestart', onMoveStart);  // Убираем слушатели
                foliumMap.off('moveend', onMoveEnd);
            };

            foliumMap.on('movestart', onMoveStart);

            if (action.type === 'zoom') {
                foliumMap.flyTo(foliumMap.getCenter(), action.value)
            } else if (action.type === 'pan') {
                foliumMap.flyTo(action.value);
            }

            foliumMap.on('moveend', onMoveEnd);

            foliumIndex++;
        }, 1000)

        setTimeout(() => {
            clearInterval(foliumInterval);
            // console.log(median(move_time))
        }, 20000);


        setTimeout(() => {
            console.log("page load time ", pageLoadTime)
            console.log("move time ", median(move_time))
            console.log("fps", median(fps))

            var elem = document.getElementsByClassName("popup")
            elem[0].style.opacity = 100

            let score = benchmarkResult(pageLoadTime / 1000, median(fps), median(move_time) / 1000)

            var result = document.getElementsByClassName("result")
            result[0].innerHTML = "Результат: " + Math.round(score) + " баллов"

            benchmarkResult(pageLoadTime / 1000, median(fps), median(move_time) / 1000)
        }, 30000)

    }
}, 100);






