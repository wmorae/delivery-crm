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
String.prototype.capitalize = function () {
    const arr = this.valueOf().toLowerCase().split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }

    return arr.join(" ");
}

const paginate = function( arr,n=arr.length){
    let arr2 = []
    let arr3 = [...arr]
    if (n>arr.length)
        n=arr.length
    let m = Math.floor(arr.length / n)
    let l = arr.length % n
    for(let i =0; i<n; i++){
        let j = m;
        i<l && j++
        arr2.push(arr3.splice(0,j))
    }    
    return arr2
}
let produtosTotais = function (pedidos) {
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
let pagamentosTotais = function (pedidos) {
    let arr = []
    for (let pedido of pedidos) {
        if (arr[pedido.pagamento.metodo]) {
            arr[pedido.pagamento.metodo] += pedido.pagamento.total
        }
        else {
            arr[pedido.pagamento.metodo] = pedido.pagamento.total
        }


    }

    arr.entregas = pedidos.map(i => i.cliente.frete).reduce((total, num) => total + num, 0)
    arr.total = Object.values(arr).reduce((total, num) => total + num, 0)
    //arr.sort((a, b) => a<b? a : b)
    return arr
}

module.exports = {
    formatDate: formatDate,
    formatDate2: formatDate2,
    formatHour: formatHour,
    produtosTotais: produtosTotais,
    pagamentosTotais: pagamentosTotais,
    paginate:paginate
};