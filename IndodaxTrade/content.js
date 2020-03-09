'use strict'
/*
    Name: Bot Trading
    Broker: Indodax
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

function trade() {
    setTimeout(() => {
        var price = document.querySelector("body > section > div > div.mainpanel > div.contentpanel > div:nth-child(1) > div.col-lg-8 > div:nth-child(1) > div > div.table-responsive.noborder > table > tbody > tr:nth-child(1) > td.market-price-box > strong")
        if (price != null) {
            var priceFix = price.innerText.split(",").join("")
            priceContainer.push(priceFix)
            console.log("Harga >> " + priceFix)
            trade()
            // Jika sudah 15 detik
            if (count == 15) {
                calculate(priceFix)
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

    // var openPrice = document.querySelector("#chart > div > p:nth-child(7) > span:nth-child(2)").innerText
    // var splitOpFix = openPrice.replace("O:", "")
    // console.log("Open Price >> " + splitOpFix)

    hasil = ((max - min) / max) * 100
    data.unshift(hasil)

    // if (priceNow >= splitOpFix[1]) {
    //     console.log("Candle Hijau, Harga terakhir lebih besar dari harga pembukaan")
    // } else {
    //     console.log("Candle Merah, Harga terakhir lebih kecil dari harga pembukaan")
    // }
    console.log("Price max: " + max + " | Price min: " + min + " | Hasil : " + hasil + "%")
}

console.log("Menunggu 5 detik")
setTimeout(() => {
    console.log("Trading di Indodax")
    trade()
}, 5000)