ElectronHelper = {
  init: function () {
  },
  _configFilePath: 'config.json',
  mount: function (vue, attrs, callback) {
    if (Array.isArray(attrs) === false) {
      attrs = [attrs]
    }
    
    fs.readFile(path.join(this.getBasePath(), this._configFilePath), function (err, data) {
      if (err) throw err;
      
      data = JSON.parse(data.toString())
      attrs.forEach(attr => {
        if (typeof(data[attr]) !== 'undefined') {
          vue[attr] = data[attr]
        }
      })
      
      if (typeof(callback) === 'function') {
        callback(data)
      }
    });
  },
  persist: function (vue, attrs, callback) {
    if (Array.isArray(attrs) === false) {
      attrs = [attrs]
    }
    
    let data = {}
    attrs.forEach(attr => {
      data[attr] = vue[attr]
    })
    
    let dataString = JSON.stringify(data, null, "\t")
    fs.writeFile(path.join(this.getBasePath(), this._configFilePath), dataString, function (err) {
      if (err) throw err;
      if (typeof(callback) === 'function') {
        callback(data)
      }
    });
  },
  getBasePath: function () {
    if (this.basepath === null) {
      let basepath = './'
      if (typeof(process.env.PORTABLE_EXECUTABLE_DIR) === 'string') {
        basepath = process.env.PORTABLE_EXECUTABLE_DIR
      }
      this.basepath = basepath
    }
    return this.basepath
  },
  basepath: null
}

ElectronHelper.init()

window.ElectronHelper = ElectronHelper