
let dropdown = document.querySelector(".dropdown-menu");
let pesquisar = async function (q) {
    let res = await axios.get("/search?q=" + q);
    return (res.data)
}
let additem = function (element, ind = true) {
    let item = document.createElement('li');
    item.innerHTML = element;
    if (ind)
        dropdown.prepend(item)
    else
        dropdown.append(item)

};
let addcontato = function (contato) {
    let element = '<button class="dropdown-item d-flex justify-content-evenly contato" type="button" ><span class="p-1">' + contato.nome + '</span > <span class="p-1">' + contato.telefone + '</span></button > '
    let item = document.createElement('li');
    item.innerHTML = element;
    item.onclick = function () {
        document.querySelector("#q").value = contato.nome;
        document.querySelector("#telefone").value = contato.telefone;
        document.querySelector("#endereco").value = contato.endereco;
        document.querySelector("#frete").value = contato.frete;
        document.querySelector("#id").disabled = false
        document.querySelector("#id").value = contato._id;
    }
    dropdown.append(item)

}

let y = async function () {
    let el = document.querySelector('#q');
    for (let e of document.querySelectorAll(".dropdown-menu > li .contato")) {
        e.remove();
    }
    if (el.value) {
        let res = await pesquisar(el.value);

        if (!res.length)
            additem('<button class="dropdown-item disabled contato"href="#" tabindex="-1" aria-disabled="true">Sem Resultados</button >', false)
        else if (res.length >= 6) {
            res = res.slice(0, 5)
            additem('<button class="dropdown-item disabled contato text-center"href="#" tabindex="-1" aria-disabled="true"><span class="p-5">...</span></button >', false)
        }

        res.forEach(contato => {
            addcontato(contato);
        })
    } else {

        additem('<button class="dropdown-item disabled contato"href="#" tabindex="-1" aria-disabled="true">Pesquise um nome ou telefone</button > ', false);

    }

    el.oninput = x;
    dropdown.classList.add("show");

}
let x = function () {
    document.querySelector('#q').oninput = null;
    dropdown.classList.remove("show");
    setTimeout(y, 750);
};

document.querySelector('#q').oninput = x;
document.querySelector('#q').onfocus = y
document.querySelector('#q').onblur = () => {
    setTimeout(() => dropdown.classList.remove("show"), 350);
};

let i = 0;
let comandaAdd = function (item, preco = 0) {
    let template = `<div class="pedido card p-2 d-flex flex-row flex-nowrap justify-content-evenly">
                            <div class="flex-grow-1">
                                <div class="input-group mb-1">
                                    <input type="number" id="qty" name="itens[${i}][qty]"  class="form-control" value="1">
                                  
                                    <input name="itens[${i}][desc]" style="width:25%" class="form-control marmita" list="listMarmitas"
                                        id="Marmitas" placeholder="Digite o Item">
                                    <datalist id="listMarmitas">
                                        <option value="Marmita P">
                                        <option value="Marmita M">
                                        <option value="Marmita G">
                                        <option value="Buffet">
                                        <option value="Outros">
                                    </datalist>
                                 
                                    <input name="itens[${i}][prot]" style="width:25%" class="form-control proteina" list="listProteinas"
                                        id="Proteinas" placeholder="Proteina..">
                                    <datalist id="listProteinas">
                                        <option value="Bisteca Milanesa">
                                        <option value="Bisteca Grelhada">
                                        <option value="Peito Grelhado">
                                        <option value="Peito Milanesa">
                                        <option value="Porco no Tacho">
                                        <option value="Figado Acebolado">
                                        <option value="Outros">
                                    </datalist>

                                </div>
                                <div class="input-group">
                                    <input name="itens[${i}][obs]" style="width:50%" type="text" class="form-control obs"
                                        placeholder="Observa????es"  onClick="this.select();" value="Completa">
                                    <span class="input-group-text mb-8">R$</span>
                                    <input name="itens[${i}][valor]" type="number" required step="0.01" min="0" class="form-control preco">
                                </div>

                            </div>
                            <button type="button" class="delete btn btn-outline-danger flex-grow-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                    class="bi bi-trash" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z">
                                    </path>
                                    <path fill-rule="evenodd"
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z">
                                    </path>
                                </svg>
                            </button>



                        </div>`
    let cont = document.querySelector('.pedidos');
    let element = document.createElement('div')
    element.innerHTML = template;
    element.querySelector(".marmita").value = item
    element.querySelector(".preco").value = preco
    if (item.indexOf("Marmita") < 0)
        element.querySelector(".obs").value = ''
    element.querySelector(".delete").onclick = function () {
        this.parentElement.remove()
    }
    cont.prepend(element)
    document.querySelector("#fechar").disabled = false;
    window.scrollTo(0, document.body.scrollHeight);
    i++;
}

document.querySelector("#m_p").onclick = () => comandaAdd('Marmita P', 8)
document.querySelector("#m_m").onclick = () => comandaAdd('Marmita M', 12)
document.querySelector("#m_g").onclick = () => comandaAdd('Marmita G', 15)
document.querySelector("#buf").onclick = () => comandaAdd('Buffet', 11.90)
document.querySelector("#m_o").onclick = () => comandaAdd('Outros')


document.querySelectorAll(".delivery").forEach(x => x.onclick = () => {
    document.querySelectorAll(".contato-info input:not(#id)").forEach(el => {
        if (el.id != "telefone")
            el.required = true
        el.disabled = false
    })
    document.querySelectorAll("div.contato-info").forEach(div => div.classList.remove("d-none"));
})
document.querySelector("#balcao").onclick = () => {
    document.querySelectorAll(".contato-info input:not(#id)").forEach(el => {
        el.required = false
        el.disabled = true
    })
    document.querySelectorAll("div.contato-info").forEach(div => div.classList.add("d-none"));
}

let btn = document.querySelector("#fechar")
document.querySelector('form').onsubmit = () => {
    btn.disabled = true;
    btn.innerText = "Processando..."
}

document.querySelectorAll("input[name='pagamento[metodo]']").forEach(x => {
    if (x.value == 'dinheiro') {
        x.oninput = function () {
            const troco = document.querySelector('#troco')
            const inpt = document.querySelector('#trocopara')
            troco.classList.remove('d-none')
            troco.classList.add('btn-outline-success')
            troco.classList.remove('btn-success')
            inpt.disabled = true;
            inpt.required = false;
            inpt.parentNode.classList.add('d-none')

        }

    } else {
        x.oninput = function () {
            const troco = document.querySelector('#troco')
            const inpt = document.querySelector('#trocopara')
            troco.classList.add('d-none')
            troco.classList.add('btn-outline-success')
            troco.classList.remove('btn-success')
            inpt.disabled = true;
            inpt.required = false;
            inpt.parentNode.classList.add('d-none')

        }
    }
})

document.querySelector('#troco').onclick = function () {
    this.classList.toggle('btn-outline-success')
    this.classList.toggle('btn-success')
    const inpt = document.querySelector('#trocopara')
    inpt.disabled = !inpt.disabled;
    inpt.required = inpt.disabled;
    inpt.parentNode.classList.toggle('d-none')
    inpt.focus();
}

