//listen to an open-file-dialog command and sending back selected information
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-file-dialog-chrome', function (event, dir) {
  //console.log(process.platform)
  
  let options = {
    title: 'Please select Google Chrome',
    properties: ['openFile']
  }
  
  if (dir !== '') {
    if (process.platform === 'win32') {
      dir = dir.split('/').join('\\')
    }
    options.defaultPath = dir
  }
  
  if (process.platform === 'win32') {
    options.filters = [
      { name: 'Executable File', extensions: ['exe'] }
    ]
  }
  
  //console.log(options)
  
  dialog.showOpenDialog(options, function (files) {
    if (files) {
      event.sender.send('selected-file-chrome', files[0])
    }
  })
})

ipc.on('open-file-dialog-icon', function (event, dir) {
  let options = {
    title: 'Please select a icon image',
    properties: ['openFile']
  }
  
  if (dir !== '') {
    if (process.platform === 'win32') {
      dir = dir.split('/').join('\\')
    }
    options.defaultPath = dir
  }
  
  if (process.platform === 'win32') {
    options.filters = [
      { name: 'Images', extensions: ['ico', 'png', 'jpg', 'jpeg', 'gif'] }
    ]
  }
  
  //console.log(options)
  
  dialog.showOpenDialog(options, function (files) {
    if (files) {
      event.sender.send('selected-file-icon', files[0])
    }
  })
})