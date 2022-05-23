const canvas=document.querySelector('canvas')
const scoreEl=document.querySelector('#scoreEl')

const c=canvas.getContext("2d")
canvas.width=window.innerWidth
canvas.height=window.innerHeight

class Boundary{
	static width=40
	static height=40
	constructor ({position,image}){
		this.position=position
		this.width=40
		this.height=40
    this.image=image
	}
	draw(){
		// c.fillStyle='blue'
		// c.fillRect( this.position.x,this.position.y,this.width,this.height)
    c.drawImage(this.image,this.position.x,this.position.y)
	}
}
class Player{
  constructor({position,velocity}){
    this.position=position
    this.velocity=velocity
    this.radius=15
  }
  draw(){
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fillStyle='yellow'
    c.fill()
    c.closePath()
  }
  update(){
    this.draw()
    this.position.x+=this.velocity.x
    this.position.y+=this.velocity.y
  }
}

class Pellet{
  constructor({position}){
    this.position=position
    this.radius=3
  }
  draw(){
    c.beginPath()
    c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
    c.fillStyle='white'
    c.fill()
    c.closePath()
  }
}

const pellets = []
const boundaries = []
const player=new Player({
position:{x:Boundary.width*1.5,y:Boundary.height*1.5},
velocity:{x:0,y:0}
})

const keys = {
  w:{pressed:false},
  a:{pressed:false},
  s:{pressed:false},
  d:{pressed:false}
}

const map=[
  ['1','-','-','-','-','-','-','-','-','-','2'],
  ['|','.','.','.','.','.','.','.','.','.','|'],
  ['|','.','b','.','[','7',']','.','b','.','|'],
  ['|','.','.','.','.','_','.','.','.','.','|'],
  ['|','.','[',']','.','.','.','[',']','.','|'],
  ['|','.','.','.','.','^','.','.','.','.','|'],
  ['|','.','b','.','[','+',']','.','b','.','|'],
  ['|','.','.','.','.','_','.','.','.','.','|'],
  ['|','.','[',']','.','.','.','[',']','.','|'],
  ['|','.','.','.','.','^','.','.','.','.','|'],
  ['|','.','b','.','[','5',']','.','b','.','|'],
  ['|','.','.','.','.','.','.','.','.','p','|'],
  ['4','-','-','-','-','-','-','-','-','-','3']
]
function createImage(src){
  const image=new Image()
  image.src=src
  return image
}

map.forEach((row,i)=>{
	row.forEach((symbol,j) =>{
		switch(symbol){
      case '-':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeHorizontal.png')})
        )
        break
       case '|':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeVertical.png')})
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner1.png')})
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner2.png')})
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner3.png')})
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCorner4.png')})
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/block.png')})
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capLeft.png')})
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capRight.png')})
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capBottom.png')})
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/capTop.png')})
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeCross.png')})
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorTop.png')})
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorRight.png')})
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorBottom.png')})
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position:{x:Boundary.width*j,y:Boundary.height*i},
            image:createImage('./img/pipeConnectorLeft.png')})
        )
        break
      case '.':
        pellets.push(
          new Pellet({position:{x:Boundary.width*j+Boundary.width/2,y:Boundary.height*i+Boundary.height/2}}))
        break
		}
	})
})
lastKey=""
score=0

function circleCollidesWithRectangle ({player,boundary}){
  return (
    player.position.y-player.radius+player.velocity.y <= boundary.position.y + boundary.height &&
    player.position.x+player.radius+player.velocity.x>=boundary.position.x &&
    player.position.y+player.radius+player.velocity.y>=boundary.position.y &&
    player.position.x-player.radius+player.velocity.x<=boundary.position.x+boundary.width)
}

function animate(){
  c.clearRect(0,0,canvas.width,canvas.height)
  // c.fillStyle="black"
  // c.fillRect(0,0,canvas.width,canvas.height)
  //
  requestAnimationFrame(animate)

  if (keys.w.pressed && lastKey==='w'){
     for(let i=0;i<boundaries.length;i++){
       const boundary=boundaries[i]
       if (circleCollidesWithRectangle(
         {player: {...player,velocity:{x:0,y:-5}},
         boundary:boundary}
         )){
         player.velocity.y=0
         break
       } else {
         player.velocity.y=-5
       }
     }
  }
  else if (keys.a.pressed && lastKey==='a'){
    for(let i=0;i<boundaries.length;i++){
      const boundary=boundaries[i]
      if (circleCollidesWithRectangle(
        {player: {...player,velocity:{x:-5,y:0}},
          boundary:boundary}
      )){
        player.velocity.x=0
        break
      } else {
        player.velocity.x=-5
      }
    }
  }
  else if (keys.s.pressed && lastKey==='s'){
    for(let i=0;i<boundaries.length;i++){
      const boundary=boundaries[i]
      if (circleCollidesWithRectangle(
        {player: {...player,velocity:{x:0,y:5}},
          boundary:boundary}
      )){
        player.velocity.y=0
        break
      } else {
        player.velocity.y=5
      }
    }
  }
  else if (keys.d.pressed && lastKey==='d'){
    for(let i=0;i<boundaries.length;i++){
      const boundary=boundaries[i]
      if (circleCollidesWithRectangle(
        {player: {...player,velocity:{x:5,y:0}},
          boundary:boundary}
      )){
        player.velocity.x=0
        break
      } else {
        player.velocity.x=5
      }
    }
  }
// score  add  4 pallet colide
  for(let i=pellets.length-1;0<i;i--){
    const pellet=pellets[i]
    pellet.draw()
    if(Math.hypot(
      pellet.position.x-player.position.x,
      pellet.position.y-player.position.y) < pellet.radius + player.radius){
      pellets.splice(i,1)
      score+=10
      scoreEl.innerHTML=score
    }
  }

  boundaries.forEach(boundary => {
    boundary.draw()
    if (circleCollidesWithRectangle({player:player,boundary:boundary})) {
      player.velocity.x=0
      player.velocity.y=0
    }
  })

  player.update()
  // player.velocity.x=0
  // player.velocity.y=0
}

animate()

window.addEventListener('keydown',({key})=>{
  switch (key) {
    case'w':
      lastKey="w"
      keys.w.pressed=true
      break
    case 'a':
      lastKey="a"
      keys.a.pressed=true
      break
    case's':
      lastKey="s"
      keys.s.pressed=true
      break
    case 'd':
      lastKey="d"
      keys.d.pressed=true
      break
  }
})

window.addEventListener('keyup',({key})=>{
  switch (key) {
     case'w':
      keys.w.pressed=false
      break
    case 'a':
      keys.a.pressed=false
      break
    case's':
      keys.s.pressed=false
      break
    case 'd':
      keys.d.pressed=false
      break
  }
})
