const canvas=document.querySelector('canvas')
const c=canvas.getContext("2d")
canvas.width=window.innerWidth
canvas.height=window.innerHeight

class Boundary{
	static width=40
	static height=40
	constructor ({position}){
		this.position=position
		this.width=40
		this.height=40
	}
	draw(){
		c.fillStyle='blue'
		c.fillRect( this.position.x,this.position.y,this.width,this.height)
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
  ['-','-','-','-','-','-','-','-'],
  ['-',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ','-',' ','-','-',' ','-'],
  ['-',' ',' ',' ',' ',' ',' ','-'],
  ['-','-','-','-','-','-','-','-']
]
map.forEach((row,i)=>{
	row.forEach((symbol,j) =>{
		switch(symbol){
			case '-':
				boundaries.push(
					new Boundary({position:{x:Boundary.width*j,y:Boundary.height*i}})
				)
				break
		}
	})
})
lastKey=""

function circleCollidesWithRectangle ({player,boundary}){
  return (
    player.position.y-player.radius+player.velocity.y <= boundary.position.y + boundary.height &&
    player.position.x+player.radius+player.velocity.x>=boundary.position.x &&
    player.position.y+player.radius+player.velocity.y>=boundary.position.y &&
    player.position.x-player.radius+player.velocity.x<=boundary.position.x+boundary.width)
}

function animate(){
  c.clearRect(0,0,canvas.width,canvas.height)
  requestAnimationFrame(animate)

  if (keys.w.pressed && lastKey==='w')
    player.velocity.y=-5
  else if (keys.a.pressed && lastKey==='a')
    player.velocity.x=-5
  else if (keys.s.pressed && lastKey==='s')
    player.velocity.y=5
  else if (keys.d.pressed && lastKey==='d')
    player.velocity.x=5

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
