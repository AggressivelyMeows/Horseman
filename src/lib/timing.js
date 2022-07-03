const all_timers = []

class ServerTiming {
    constructor(name, desc) {
        this.name = name
        this.desc = desc
        this.start = new Date()
        this.end = new Date()
        all_timers.push(this)
    }

    finish() {
        this.end = new Date()
    } 

    generate_header() {
        const time = this.end.getTime() - this.start.getTime()
        return `${this.name};dur=${time}`
    }
}
    
export {
    all_timers,
    ServerTiming
}