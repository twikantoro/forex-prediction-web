window.onload = function () {
    var barData

    //connect to socket
    const socket = io("http://localhost:5000")

    //event error
    socket.io.on("error", (error) => {
        console.log("socket error ", error)
    })

    //event connect
    socket.on("connect", () => {
        console.log("socket connected, id", socket.id)
    })

    //event disconnect
    socket.on("disconnect", () => {
        console.log("socket disconnected")
    })

    //event features
    socket.on("features", (data) => {
        console.log("features", data)
        updateChart(data.data[0])
    })

    //event predictions
    socket.on("prediction", (data) => {
        let prediksi = data.data[0]
        let prediksi_buy = (parseFloat(prediksi[1])*100).toFixed(0)
        let prediksi_sell = (parseFloat(prediksi[0])*100).toFixed(0)
        console.log("prediction", prediksi)
        document.getElementById('prediction_buy').innerText = prediksi_buy+"%"
        document.getElementById('prediction_sell').innerText = prediksi_sell+"%"
    })

    //event predictions
    socket.on("test", (data) => {
        console.log("test", data)
    })

    socket.emit("request_features")
    socket.emit("request_prediction")

    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'Nilai tukar EUR/USD',
                data: barData
            }]
        }
    });

    function updateChart(data) {
        let xs = []
        let os = []
        let hs = []
        let ls = []
        let cs = []
        let dataset = []
        for (let i = 0; i < 50; i++) {
            xs.push(parseInt(data[i]) * 1000)
            os.push(parseFloat(data[i + 50]))
            hs.push(parseFloat(data[i + 100]))
            ls.push(parseFloat(data[i + 150]))
            cs.push(parseFloat(data[i + 200]))
            dataset.push({
                x : new Date(xs[i]).valueOf(),
                o : os[i].toFixed(5),
                h : hs[i].toFixed(5),
                l : ls[i].toFixed(5),
                c : cs[i].toFixed(5)
        })
        }

        barData = dataset

        box_data_upper = []
        box_data_lower = []
        for(let i=0; i<50; i++){
            box_data_upper.push({
                x: xs[i],
                y: parseFloat(data[250])
            })
            box_data_lower.push({
                x: xs[i],
                y: parseFloat(data[251])
            })
        }

        chart.config.data.datasets = [
            {
                label: 'Nilai tukar EUR/USD',
                data: barData
            },{
                type: "line",
                label: 'Resistance',
                data: box_data_upper,
                pointRadius: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'rgba(255, 0, 0, 0.75)'
            },{
                type: "line",
                label: 'Support',
                data: box_data_lower,
                pointRadius: 0,
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                borderColor: 'rgba(0, 0, 255, 0.75)'
            }]
        chart.update()
        console.log("chart data",chart.config.data.datasets[0].data)
        console.log("data",data[0])
    }

};