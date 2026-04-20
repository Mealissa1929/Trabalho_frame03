const body=document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const arco =document.getElementsByTagName("arco");

const objArco={
    x:null,y:null,raio:null,rad:null,cor:null,
    velocidade:3,
    desenhar:function () {
       for (let a of arco) {
           this.raio = a.getAttribute("raio") || a.setAttribute("raio", 50);
           this.x = parseInt(a.getAttribute("posX")) || a.setAttribute("posX", 100);
           this.y = parseInt(a.getAttribute("posY")) || a.setAttribute("posY", 100);
           this.cor = a.getAttribute("cor") || a.setAttribute("cor", "blue");
           grau = parseInt(a.getAttribute("graus") || a.setAttribute("graus", 360));
           this.rad = grau * (Math.PI / 180);

          ctx.beginPath();
          ctx.arc(this.x,this.y,this.raio,0,this.rad,true);
          ctx.fillStyle=this.cor ;
          ctx.fill();
          ctx.closePath();
          let moverArco=a.getAttribute("mover");
          if(moverArco)
              this.mover(a,moverArco);
       }
    },
    mover:function(a,moverArco){
        if(moverArco==="acima") this.y-=this.velocidade;
        if(moverArco==="abaixo") this.y+=this.velocidade;
        if(moverArco==="esquerda") this.x-=this.velocidade;
        if(moverArco==="direita") this.x+=this.velocidade;
        a.setAttribute("posX",this.x);
        a.setAttribute("posY",this.y);
    }
};
function desenharFormas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (arco) {
        objArco.desenhar();
    }
    requestAnimationFrame(desenharFormas);
}




desenharFormas();
