const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const arco = document.getElementsByTagName("arco");
const retangulo = document.getElementsByTagName("retangulo");

const objFormas = {
    velocidade: 3,

    desenhar: function () {

        let lista = [];

        for (let a of arco) {
            lista.push({
                tipo: "arco",
                el: a,
                x: parseInt(a.getAttribute("posX")) || 100,
                y: parseInt(a.getAttribute("posY")) || 100,
                raio: parseInt(a.getAttribute("raio")) || 50,
                cor: a.getAttribute("cor") || "blue",
                mover: a.getAttribute("mover"),
                comportamento: a.getAttribute("comportamento")
            });
        }

        for (let r of retangulo) {
            lista.push({
                tipo: "retangulo",
                el: r,
                x: parseInt(r.getAttribute("posX")) || 100,
                y: parseInt(r.getAttribute("posY")) || 100,
                largura: parseInt(r.getAttribute("largura")) || 50,
                altura: parseInt(r.getAttribute("altura")) || 50,
                cor: r.getAttribute("cor") || "black",
                mover: r.getAttribute("mover"),
                comportamento: r.getAttribute("comportamento")
            });
        }

        for (let obj of lista) {
            ctx.beginPath();

            if (obj.tipo === "arco") {
                ctx.arc(obj.x, obj.y, obj.raio, 0, Math.PI * 2);
            } else {
                ctx.rect(obj.x, obj.y, obj.largura, obj.altura);
            }

            ctx.fillStyle = obj.cor;
            ctx.fill();
            ctx.closePath();
        }

        for (let i = 0; i < lista.length; i++) {
            for (let j = i + 1; j < lista.length; j++) {

                let a = lista[i];
                let b = lista[j];

                let podeColidir = true;

                if (a.tipo !== b.tipo) {
                    if (!mesmaOrientacao(a.mover, b.mover)) {
                        podeColidir = false;
                    }
                }

                if (!podeColidir) continue;

                let colidiu = false;

                if (a.tipo === "arco" && b.tipo === "arco") {
                    let dx = a.x - b.x;
                    let dy = a.y - b.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    colidiu = dist < a.raio + b.raio;
                } else {
                    colidiu = (
                        a.x < b.x + (b.largura || b.raio) &&
                        a.x + (a.largura || a.raio) > b.x &&
                        a.y < b.y + (b.altura || b.raio) &&
                        a.y + (a.altura || a.raio) > b.y
                    );
                }

                if (colidiu) {
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
        criarForma(obj.tipo);
        criarForma(obj.tipo);
    }

    if (obj.comportamento === "dividir") {
        criarForma(obj.tipo);
    }
}

function criarForma(tipo) {
    let novo = document.createElement(tipo);

    novo.setAttribute("posX", 100);
    novo.setAttribute("posY", 100);
    novo.setAttribute("cor", "green");
    novo.setAttribute("mover", "direita");

    if (tipo === "arco") {
        novo.setAttribute("raio", 20);
    } else {
        novo.setAttribute("largura", 50);
        novo.setAttribute("altura", 50);
    }

    document.body.appendChild(novo);
}

function desenharFormas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objFormas.desenhar();
    requestAnimationFrame(desenharFormas);
}

desenharFormas();
