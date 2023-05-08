class Player {
  constructor(id,x, y,score, radius, color) {
    this.id=id
    this.x = x
    this.y = y
    this.score=score
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}
