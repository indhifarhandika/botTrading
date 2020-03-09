'use strict'
/*
    Name: Bot Trading
    Broker: Huobi
*/


var priceContainer = []

// Function Remove array from index n to index n
Array.prototype.hapus = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var count = 1
var countData = 1
var data = []
var waktuStart = 0

responsiveVoice.setDefaultVoice("Indonesian Female");

function Result(max, min, resl){
    this.PriceMax = max
    this.PriceMin = min
    this.Hasil = resl
}

function trade() {
    setTimeout(() => {
        var price = document.querySelector("#__layout > section > section > dl.l > dt > div > div.ticker > div.price-container > span.price.color-up") == undefined ? document.querySelector("#__layout > section > section > dl.l > dt > div > div.ticker > div.price-container > span.price.color-down") : document.querySelector("#__layout > section > section > dl.l > dt > div > div.ticker > div.price-container > span.price.color-up");
        if (price != null) {
            priceContainer.push(price.innerText)
            console.log(`Harga >> ${price.innerText}`)
            trade()
            // Jika sudah 15 detik
            if (count == 15) {
                calculate(price.innerText)
                // console.log(priceContainer)
                if (priceContainer.length >= 180) {
                    // console.log(data)
                    data.hapus(0, 3)
                    hapusArray60()
                    // console.log("Sudah 3 Menit")
                }
                count = 0
            }
            count++
        }

    }, 1000)
}

function hapusArray60() {
    var dataHapus = []
    for (let index = 0; index < 60; index++) {
        dataHapus.push(priceContainer[index])
        priceContainer.shift()
    }
    // console.log("Data yang dihapus >>> ", dataHapus)
}

function calculate(priceNow) {
    var hasil = 0
    var max = Math.max(...priceContainer)
    var min = Math.min(...priceContainer)

    var openPrice = document.querySelector("#chart > div > p:nth-child(7) > span:nth-child(2)").innerText
    var splitOpFix = openPrice.replace("O:", "")
    // console.log("Open Price >> " + splitOpFix + "| price now: "+ priceNow)

    hasil = ((max - min) / max) * 100
    data.unshift(hasil)

    if (parseFloat(splitOpFix) > parseFloat(priceNow)) {
        console.log("Candle Merah")
        responsiveVoice.speak("Candle Merah");
    } else if (parseFloat(priceNow) > parseFloat(splitOpFix)) {
        console.log("Candle Hijau")
        responsiveVoice.speak("Candle Hijau");
    }
    var res = new Result(max, min, hasil)
    console.table(res)
    // console.warn("Price max: " + max + " | Price min: " + min + " | Hasil: " + hasil + "%")
}

function start(waktuku) {
    console.log("Menunggu menit ke " + waktuku)
    setTimeout(() => {
        var waktu = document.querySelector("#chart > div > p:nth-child(7) > span:nth-child(1)").innerText
        
        if(waktuku.length > 1){
            waktuku = waktuku[1]
        }

        if (waktu[10] == waktuku) {
            console.log("Start Trading => ", waktu)
            trade()
        } else {
            start(waktuku)
        }
    }, 1000)
}

console.log("Menunggu 5 detik")
setTimeout(() => {
    console.log("Trading di Huobi")
    var waktuStart = document.querySelector("#chart > div > p:nth-child(7) > span:nth-child(1)").innerText
    start(parseInt(waktuStart[10]) + 1)
}, 5000)