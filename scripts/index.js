let cartasMostradas = [];
let cartasAcertadas = [];

var puntos = 0;
let puntuacion = document.getElementsByClassName('punto');

var ruta = '';
var dificultad = 0;
var numImg = 0;
let tablero = document.getElementsByClassName("containTablero");

/* BOTON INFO ========================================================================== */

document.querySelector('#info').addEventListener('click', function(){
    document.querySelector('.modalInfo').classList.add('rotar');
    document.querySelector('.modalDificultad').classList.add('rotar');
})

document.querySelector('#cerrar').addEventListener('click', function(){
    document.querySelector('.modalInfo').classList.remove('rotar');
    document.querySelector('.modalDificultad').classList.remove('rotar');
})


/* SELECCIONAR DIFICULTAD ================================================================== */
document.querySelector('.facil').addEventListener('click', function () {
    mostrarTablero();
    document.querySelector('.containTablero').classList.add('facil');
    dificultad = 4;
    numImg = 12;
    ruta = 'img/normales/';
    generarCartas(dificultad, tablero, numImg, ruta);
})

document.querySelector('.medio').addEventListener('click', function(){
    mostrarTablero();
    document.querySelector('.containTablero').classList.add('medio');
    dificultad = 6;
    numImg = 22;
    ruta = 'img/normales/';
    generarCartas(dificultad, tablero, numImg, ruta);
})

document.querySelector('.dificil').addEventListener('click', function() {
    mostrarTablero();
    document.querySelector('.containTablero').classList.add('dificil');
    dificultad = 6;
    numImg = 22;
    ruta = 'img/vacas/';
    generarCartas(dificultad, tablero, numImg, ruta);
})

function mostrarTablero() {
    document.querySelector('.modalTablero').classList.add('active');
    document.querySelector('.modalPrincipal').classList.add('ocultar');
}


/*GENERA LAS CARTAS =====================================================================*/ 
function generarCartas(numDificultad,tablero, numCartas,ruta){
    puntuacion[0].innerText = 0;
    puntos = 0;
    let img = imagenes(numDificultad, numCartas) //lista de id de imagenes
    document.querySelector('.salir').classList.add('mostrar')

    for(let i = 0; i < numDificultad*numDificultad; i++) {
        //Crear las cartas
        let carta = document.createElement("div");
        carta.setAttribute("class", "carta");
        carta.setAttribute('visible', 'false');
        carta.setAttribute('id', img[i]);
        tablero[0].appendChild(carta)

        //Crear el frente
        let front = document.createElement('div');
	    front.setAttribute("class", "front");
        front.setAttribute('style', 'background-image: url('+ruta+img[i]+'.jpg);')
	    carta.appendChild(front);

        //Crear la trasera
        let back = document.createElement('div');
        back.setAttribute('class', 'back');
        back.setAttribute('style', 'background-image: url(img/Reversa.jpg)');
        carta.appendChild(back);

            /* EVENTO DE LAS CARTAS */
        carta.onclick = function () {
            if(carta.getAttribute('visible') == 'false') {
                carta.classList.add('mostrar');
                carta.setAttribute('visible', 'true');
                cartasMostradas.push(carta);
                comprobarParejas(cartasMostradas, numDificultad);
            }

        }
    }
}

/* GENERA LA LISTA DE LAS IMAGENES ================================================ */
function imagenes(numDificultad,numCartas) {
    let img = [];
    let imgBaraja = [];
    img.length = numDificultad*numDificultad;

    let i = 0;
    while(i < img.length) {
        let num = Math.floor(Math.random()*numCartas); // Da el numero de cartas diferentes que tiene que haber en la partida
        if(!img.includes(num)){
            img[i] = num;
            img[i+1] = num;
            i += 2;
        }
    }
    //BARAJAR LAS CARTAS
    i = 0;
    while(i<img.length) {
        let randomNum = img[Math.floor(Math.random()*img.length)]
        if(contarRepeticiones(imgBaraja,randomNum) < 2) {
            imgBaraja[i] = randomNum;
            i++;
        } 
    }

    return imgBaraja
}

//Comprueba cuantas repeticiones hay de una imagen en una lista
function contarRepeticiones(lista, num) {
    let rep = 0;
    for(i=0;i<lista.length;i++){
        if(lista[i] == num) {
            rep++
        }
    }
    return rep;
}

// Comprueba las parejas de una lista (normalmente la lista de cartasMostradas)
function comprobarParejas(lista, numDificultad) {
    if(lista.length == 2) {
        if(lista[0].getAttribute('id') == lista[1].getAttribute('id')){
            cartasMostradas = [];
            cartasAcertadas.push(lista[0]);
            cartasAcertadas.push(lista[1]);
            puntos += 10;
            puntuacion[0].innerText = puntos;
            ganarPartida(numDificultad);
        }else{
            
            setTimeout(function() {
                document.querySelector('.containTablero').classList.add('bloqueo');
                if(puntos != 0){
                    puntos--;
                }
                puntuacion[0].innerText = puntos;
            }, 90)

            setTimeout(function () {
                lista[0].setAttribute('visible','false');
                lista[0].classList.remove('mostrar');
                lista[1].setAttribute('visible','false');
                lista[1].classList.remove('mostrar');
                cartasMostradas = [];
                setTimeout(function() {
                    document.querySelector('.containTablero.bloqueo').classList.remove('bloqueo');
                }, 500)
            },1000)
        }
    }
}

// Comprueba si se ha ganado la partida
function ganarPartida(numDificultad){
    if(cartasAcertadas.length == numDificultad*numDificultad) {
        console.log('HAS GANADO')
        setTimeout(function () {
            document.querySelector('.modalFin').classList.add('mostrar')
            puntuacion[1].innerText = puntos
        },1000)
    }
}

// Boton de salir
document.querySelector('.salir').addEventListener('click', function() {
    let cartas = Array.prototype.slice.call(document.getElementsByClassName("carta"), 0);
    for(element of cartas){
        element.remove();
    }
    document.querySelector('.modalTablero').classList.remove('active');
    document.querySelector('.modalPrincipal').classList.remove('ocultar');
    document.querySelector('.salir').classList.remove('mostrar');
    document.querySelector('.containTablero').classList.remove('facil','medio','dificil');
    cartasAcertadas = [];
    cartasMostradas = [];
    puntuacion[0].innerText = 0;
})

/* MODAL GANADO */
//Boton de cerrar
document.querySelector('.cerrar').addEventListener('click', function() {
    let cartas = Array.prototype.slice.call(document.getElementsByClassName("carta"), 0);
    for(element of cartas){
        element.remove();
    }
    document.querySelector('.modalFin').classList.remove('mostrar');
    document.querySelector('.modalTablero').classList.remove('active');
    document.querySelector('.modalPrincipal').classList.remove('ocultar');
    document.querySelector('.containTablero').classList.remove('facil','medio','dificil');
    document.querySelector('.salir').classList.remove('mostrar');
    cartasAcertadas = [];
    cartasMostradas = [];
})

//Boton de Jugar de nuevo
document.querySelector('.re').addEventListener('click', function() {
    let cartas = Array.prototype.slice.call(document.getElementsByClassName("carta"), 0);
    let numCartas = Math.sqrt(cartas.length);
    console.log(numCartas);
    for(element of cartas){
        element.remove();
    }
    document.querySelector('.modalFin').classList.remove('mostrar');
    cartasAcertadas = [];
    cartasMostradas = [];
    puntuacion[0].innerText = 0;
    generarCartas(dificultad, tablero, numImg, ruta);
})
