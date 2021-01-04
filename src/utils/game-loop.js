export default class GameLoop {
  subscribers = []
  loopID = null

  loop = () => {
    this.subscribers.forEach((callback) => {
      callback.call()
    })

    this.loopID = window.requestAnimationFrame(this.loop)
  }

  start = () => {
    if (!this.loopID) {
      this.loop()
    }
  }

  stop = () => {
    if (!this.loopID) {
      window.cancelAnimationFrame(this.loopID)
      this.loopID = null
    }
  }

  subscribe = (callback) => this.subscribers.push(callback)

  unsubscribe = (id) => this.subscribers.splice(id - 1, 1)
}
