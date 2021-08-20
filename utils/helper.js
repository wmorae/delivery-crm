let formatDate = dt => {
    if (dt != undefined) {
        let r = " " + dt.getDate();
        r += "/" + (dt.getMonth() + 1);
        r += "/" + (dt.getFullYear());
        r += " " + ("0" + dt.getHours()).slice(-2);
        r += ":" + ("0" + dt.getMinutes()).slice(-2);
        return r;
    } else {
        return "-"
    }

}
let formatHour = hr => {
    if (hr != undefined) {
        let r = ("0" + hr.getHours()).slice(-2);
        r += ":" + ("0" + hr.getMinutes()).slice(-2);
        return r;
    } else {
        return "-"
    }
}
let formatDate2 = dt => {
    if (dt != undefined) {
        let r = (dt.getFullYear());
        r += "-" + ("0" + (dt.getMonth() + 1)).slice(-2);
        r += "-" + ("0" + dt.getDate()).slice(-2);
        return r;
    } else {
        return "-"
    }

}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

let resumoPedidos = function (pedidos) {
    let arr = []
    for (let pedido of pedidos) {
        for (let item of pedido.itens) {
            if (arr[item.desc]) {
                arr[item.desc].qty += item.qty
                arr[item.desc].valor += item.valor
            }
            else {
                arr[item.desc] = {}
                arr[item.desc].qty = item.qty
                arr[item.desc].valor = item.valor
            }
        }

    }
    // arr.sort((a, b) => b.qty - a.qty)
    return arr
}

module.exports = {
    formatDate: formatDate,
    formatDate2: formatDate2,
    formatHour: formatHour,
    indexPedidos: resumoPedidos
};