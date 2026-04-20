const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const arco = document.getElementsByTagName("arco");

const objArco = {
    velocidade: 3,

    desenhar: function () {

        let lista = [];

        for (let a of arco) {

            let obj = {
                el: a,
                x: parseInt(a.getAttribute("posX")) || 100,
                y: parseInt(a.getAttribute("posY")) || 100,
                raio: parseInt(a.getAttribute("raio")) || 50,
                cor: a.getAttribute("cor") || "blue",
                mover: a.getAttribute("mover"),
                comportamento: a.getAttribute("comportamento")
            };

            lista.push(obj);

            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.raio, 0, Math.PI * 2);
            ctx.fillStyle = obj.cor;
            ctx.fill();
            ctx.closePath();
        }

        for (let i = 0; i < lista.length; i++) {
            for (let j = i + 1; j < lista.length; j++) {

                let a = lista[i];
                let b = lista[j];

                if (!mesmaOrientacao(a.mover, b.mover)) continue;

                let dx = a.x - b.x;
                let dy = a.y - b.y;
                let distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < a.raio + b.raio) {

                    aplicarComportamento(a);
                    aplicarComportamento(b);

                    a.el.setAttribute("mover", inverter(a.mover));
                    b.el.setAttribute("mover", inverter(b.mover));
                }
            }
        }

        for (let obj of lista) {

            if (obj.mover) {

                let x = obj.x;
                let y = obj.y;

                if (obj.mover === "acima") y -= this.velocidade;
                if (obj.mover === "abaixo") y += this.velocidade;
                if (obj.mover === "esquerda") x -= this.velocidade;
                if (obj.mover === "direita") x += this.velocidade;

                if (y > canvas.height) y = 0;
                if (y < 0) y = canvas.height;
                if (x > canvas.width) x = 0;
                if (x < 0) x = canvas.width;

                obj.el.setAttribute("posX", x);
                obj.el.setAttribute("posY", y);
            }
        }
    }
};

function inverter(dir) {
    if (dir === "acima") return "abaixo";
    if (dir === "abaixo") return "acima";
    if (dir === "esquerda") return "direita";
    if (dir === "direita") return "esquerda";
}

function mesmaOrientacao(d1, d2) {
    let vertical = ["acima", "abaixo"];
    let horizontal = ["esquerda", "direita"];

    return (
        (vertical.includes(d1) && vertical.includes(d2)) ||
        (horizontal.includes(d1) && horizontal.includes(d2))
    );
}

function aplicarComportamento(obj) {
    if (obj.comportamento === "duplicar") {
        criarArco();
        criarArco();
    }

    if (obj.comportamento === "dividir") {
        criarArco();
    }
}

function criarArco() {
    let novo = document.createElement("arco");

    novo.setAttribute("posX", 100);
    novo.setAttribute("posY", 100);
    novo.setAttribute("raio", 20);
    novo.setAttribute("cor", "green");
    novo.setAttribute("mover", "direita");

    document.body.appendChild(novo);
}

function desenharFormas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objArco.desenhar();
    requestAnimationFrame(desenharFormas);
}

desenharFormas();
