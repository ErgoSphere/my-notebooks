class LRUCache {
  private keys: number[]
  private obj: object
  private readonly len: number

  constructor(capacity: number) {
    this.keys = []
    this.obj = Object.create(null)
    this.len = capacity
  }

  get(key: number): number {
    if (Object.prototype.hasOwnProperty.call(this.obj, key)) {
      const index = this.keys.indexOf(key)
      this.keys.splice(index, 1)
      this.keys.push(key)
      return this.obj[key]
    } else {
      return -1
    }
  }

  put(key: number, value: number): void {
    if (Object.prototype.hasOwnProperty.call(this.obj, key)) {
      this.obj[key] = value
      this.get(key)
    } else {
      if (this.keys.length >= this.len) {
        const k = this.keys.shift()
        delete this.obj[k]
      }
      this.obj[key] = value
      this.keys.push(key)
    }
  }
}