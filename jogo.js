//Moonlander. Um jogo de alunissagem.
//Mario Oliveira (MarioOliveira2008)
//28/03/2025
//Versão 0.1.0


/** @type {HTMLCanvasElement} */

//seção de Modelagem de dados

let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let lancamentoPelaEsquerda = (Math.round(Math.random()) == 0)

let moduloLunar = {
    posicao: {
        x: lancamentoPelaEsquerda ? 100 : 700,
        y: 100
    },
    angulo: lancamentoPelaEsquerda ? -Math.PI/2 : Math.PI/2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x:lancamentoPelaEsquerda ? 2 : -2,
        y: 0
    },
    combustivel : 100,
    rotacaoAntiHorario: false,
    rotacaoHorario:false,

}
let estrelas = [];

for(let i = 0;i < 500 ; i++){
        estrelas[i] = { 
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    raio: Math.sqrt(4 * Math.random()),
    brilho: 1.0,
    apagando: true,
    cintilacao: 0.05 * Math.random()

}
}

//seção de visualização
function desenharModuloLunar(){
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5,
         moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if(moduloLunar.motorLigado){
        desenharChama();
    }
    
    contexto.restore();
}

function desenharChama(){
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    //Determina o tamanho da chama
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 35 );
   //2 contexto.lineTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}
function mostrarVelocidadeHorizontal(){
    mostrarIndicador(
        mensagem = ` Velocidade Horizontal:${(10 * moduloLunar.velocidade.x).toFixed(2)}`,
        x = 120,
        y = 60
    )
}
function mostrarVelocidade(){
    mostrarIndicador(
        mensagem = ` Velocidade vertical:${(10 * moduloLunar.velocidade.y).toFixed(2)}`,
        x = 120,
        y = 100
    )
}
function mostrarAngulo(){
    mostrarIndicador(
        mensagem = `Angulo ${(moduloLunar.angulo * 180 /Math.PI).toFixed(0)}º`,
        x = 400,
        y = 80
)
}
function mostrarAltitude(){
    mostrarIndicador(
        mensagem = `Altitude ${(canvas.height - moduloLunar.posicao.y -
            0.5 * moduloLunar.altura).toFixed(0)}` ,
            x = 400,
            y = 100
    );
}

function mostrarCombustivel(){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let combustivel = ` Combustivel: ${(moduloLunar.combustivel/100 * 100).toFixed(0)}%`;
    contexto.fillText(combustivel, 100, 80);
}
function gasto(){
   if( moduloLunar.combustivel > 0) {
        moduloLunar.combustivel --;
   }else{
    moduloLunar.combustivel = 0
    moduloLunar.motorLigado = false
       
}
}

function desenharEstrelas(){
    contexto.save()
    for(let i = 0; i < estrelas.length; i++){
    let estrela = estrelas[i];
    contexto.beginPath();
    contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI);
    contexto.closePath();
    contexto.fillStyle = `rgba(255, 255, 255, ${ estrela.brilho}  )` ;
    contexto.fill();
    
    if(estrela.apagando){
        estrela.brilho -= estrela.cintilacao;
        if(estrela.brilho <= 0.1){
            estrela.apagando = false 
        }
    }else{
        estrela.brilho += estrela.cintilacao;
        if(estrela.brilho >= 0.95){
           estrela.apagando = true;
        }

    }

    }
    contexto.restore();
}
function desenhar(){
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    atracaoGravitacional();
    desenharEstrelas();
     mostrarVelocidade();
     mostrarAngulo();
     mostrarAltitude();
     mostrarVelocidadeHorizontal();
     mostrarCombustivel();
    desenharModuloLunar();
    if(moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)){
       if(moduloLunar.velocidade.y >= 0.5 || 
       Math.abs(moduloLunar.velocidade.x) >=0.5 ||
        5 < Math.abs(moduloLunar.angulo)
        )
        {
      return mostrarResultado("Voce morreu de queda ", 400,300);
       }else{
       return mostrarResultado("Voce concluiu o pouso parabens ", 400, 300);
       }
    }
    requestAnimationFrame(desenhar);
}

function mostrarResultado(mensagem, cor){
    contexto.font = "bold 40xp Calibri";
        contexto.textAlign = "center";
        contexto.textBaseline = "middle";
        contexto.fillStyle = cor;
        contexto.fillText(mensagem, canvas.width/2, canvas.height/2);
}
function mostrarIndicador(mensagem, x, y){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    contexto.fillText(mensagem, x, y);
}
document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento){
   if(evento.keyCode == 38){
        moduloLunar.motorLigado = true;
        gasto();
        }else if(evento.keyCode == 39){
       moduloLunar.rotacaoAntiHorario = true;
       }else if(evento.keyCode == 37){
           moduloLunar.rotacaoHorario = true;
       }
}
document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento){
    if(evento.keyCode == 38){
        moduloLunar.motorLigado = false;
    }else if(evento.keyCode == 39){
         moduloLunar.rotacaoAntiHorario = false   
    }else if(evento.keyCode == 37){
        moduloLunar.rotacaoHorario = false
    }
}
let gravidade = 0.03;
function atracaoGravitacional(){
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    if(moduloLunar.rotacaoAntiHorario){
        moduloLunar.angulo += Math.PI/180;
    }else if(moduloLunar.rotacaoHorario){
        moduloLunar.angulo -= Math.PI/180;
    }
    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.1 * Math.cos(moduloLunar.angulo) 
        moduloLunar.velocidade.x += 0.1 * Math.sin(moduloLunar.angulo)
    }
    moduloLunar.velocidade.y += gravidade; 
    }

desenhar();