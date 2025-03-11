function novoElemento(tagName, className){
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    
    this.elemento.appendChild(reversa ? corpo : borda )
    this.elemento.appendChild(reversa ? borda : corpo )

    this.setAltura = altura => corpo.style.height = `${altura}px`

}

///const b = new Barreira(true)
//b.setAltura(200)
//document.querySelector('[tp-flappy]').appendChild(b.elemento)


function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
    
        const alturaInferior = altura - abertura - alturaSuperior
    
        this.superior.setAltura(alturaSuperior)
    
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    
    this.setX = x => this.elemento.style.left = `${x}px`
    
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

//const b = new ParDeBarreiras(700, 200, 800)
//document.querySelector('[tp-flappy]').appendChild(b.elemento)
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if(cruzouOMeio) notificarPonto()
        })
    }

}

function Passaro(alturaDoJogo) {
    let voando = false

    this.elemento = novoElemento('img','passaro')
    this.elemento.src = 'imagens/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaDoJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaDoJogo / 2)
}

function Progresso(){
    this.elemento =novoElemento ('span','progresso')

    this.attpontos = pontos =>{
        this.elemento.innerHTML = pontos
    }

    this,this.attpontos(0)
}


/*
const barreiras = new Barreiras(700,1200,200,400)
const passaro = new Passaro(700)


areadojogo.appendChild(new Progresso().elemento)
areadojogo.appendChild(passaro.elemento)
barreiras.pares.forEach(par => areadojogo.appendChild(par.elemento))

setInterval( () => {
    barreiras.animar()
    passaro.animar()
}, 20 )
*/

function sobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(passaro,barreiras){
    let colidiu = false

    barreiras.pares.forEach(ParDeBarreiras => {
        if(!colidiu) {

            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
    
            colidiu = sobrepostos(passaro.elemento, superior) 
                || sobrepostos(passaro.elemento, inferior)
        }
    })

    return colidiu
}

function FlappyBird(){
    let pontos = 0

    const areadojogo = document.querySelector('[tp-flappy]')
    const altura = areadojogo.clientHeight
    const largura = areadojogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400, () => progresso.attpontos(++pontos))

    const passaro = new Passaro(altura)

    areadojogo.appendChild(progresso.elemento)
    areadojogo.appendChild(passaro.elemento)

    barreiras.pares.forEach(par => areadojogo.appendChild(par.elemento))

    this.start = () => {
        
        const tempo = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            if(colidiu(passaro,barreiras)){
                clearInterval(tempo)
            }
            
        }, 20);

    }
}

new FlappyBird().start()