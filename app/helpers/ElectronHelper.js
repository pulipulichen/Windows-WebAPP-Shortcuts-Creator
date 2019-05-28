/* global fs */

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
  basepath: null,
  resolve: function (filePath) {
    let basepath = this.getBasePath()
    return path.resolve(basepath, filePath)
  },
  _tmpDirChecked: false,
  getTmpDirPath: function (filePath) {
    let tmpDirPath
    if (this._tmpDirChecked === false) {
      tmpDirPath = this.resolve('tmp')
      if (fs.existsSync(tmpDirPath) === false) {
        fs.mkdirSync(tmpDirPath)
      }
      this._tmpDirChecked = true
    }
    
    if (typeof(filePath) === 'string') {
      filePath = 'tmp/' + filePath
      tmpDirPath = this.resolve(filePath)
    }
    else {
      tmpDirPath = this.resolve('tmp')
    }
    
    return tmpDirPath
  },
  resolveAppPath: function (filePath) {
    if (typeof(process.env.PORTABLE_EXECUTABLE_DIR) === 'string') {
      //console.log(FileSet)
      //alert(['error', filePath ])
      //throw Error('resolveAppPath')
      //console.log(filePath)
      filePath = path.join('./resources/app.asar/app/', filePath)
      return filePath
    }
    else {
      return this.resolve('app/' + filePath)
    }
  }
}

ElectronHelper.init()

window.ElectronHelper = ElectronHelper