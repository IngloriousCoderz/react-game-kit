export default class KeyListener {
  static LEFT = 37
  static RIGHT = 39
  static UP = 38
  static DOWN = 40
  static SPACE = 32

  keys = {}

  isDown = (keyCode) => {
    return this.keys[keyCode] || false
  }

  down = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault()
      this.keys[event.keyCode] = true
    }
  }

  up = (event) => {
    if (event.keyCode in this.keys) {
      event.preventDefault()
      this.keys[event.keyCode] = false
    }
  }

  subscribe = (keys) => {
    window.addEventListener('keydown', this.down)
    window.addEventListener('keyup', this.up)

    keys.forEach((key) => {
      this.keys[key] = false
    })
  }

  unsubscribe = () => {
    window.removeEventListener('keydown', this.down)
    window.removeEventListener('keyup', this.up)
    this.keys = {}
  }
}
