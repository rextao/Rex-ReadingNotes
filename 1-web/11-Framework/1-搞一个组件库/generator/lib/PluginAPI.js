class PluginAPI {
  constructor (id, service) {
    this.id = id
    this.service = service
  }
  registerCommand (name, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = null
    }
    this.service.commands[name] = { fn, opts: opts || {}}
  }
}

module.exports = PluginAPI
