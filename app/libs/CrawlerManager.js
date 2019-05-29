/* global URLHelper */

let request = require('request')
let cheerio = require('cheerio')
let parseFavicon = require('parse-favicon').parseFavicon
let http = require('follow-redirects').http
let https = require('follow-redirects').https
let iconv = require('iconv-lite')

let CrawlerManager = {
  loadFromURL: function (url, callback) {
    let data = {}

    let urlObject = new URL(url);

    //console.log(url)
    this._requestBody(url, (body) => {
      body = this._decodeHTML(body)
      
      let $ = cheerio.load(body)
      data.title = this._parseTitle($, urlObject.host)
      data.description = this._parseDescription($, urlObject.host)
      //console.log(data)
      CrawlerIconManager.parseIcon($, body, url, data.title, (iconPath) => {
        //console.log(iconPath)
        if (typeof(iconPath) === 'string') {
          
        }
        else {
          data.icon = 'icon.ico'
        }
        
        data.icon = path.basename(iconPath)
        
        if (typeof (callback) === 'function') {
          callback(data)
        }
      })
        
    })


  },
  _requestBody: function (url, callback) {
    request({ 
      url: url, 
      encoding: null 
   }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (typeof (callback) === 'function') {
          callback(body)
        }
      } else {
        alert(error)
        throw Error(error)
      }
    })
  },
  _parseTitle: function ($, defaultValue) {
    let title = $("title").text().trim()
    if ('' === title.trim()) {
      title = defaultValue
    }
    title = PathHelper.safeFilterTitle(title)
    return title
  },
  _parseDescription: function ($, defaultValue) {
    let desc = $('meta[name="description"]').attr('content')
    if (desc === undefined) {
      desc = $("title").text().trim()
      if ('' === desc.trim()) {
        desc = defaultValue
      }
    }
    desc = PathHelper.safeFilter(desc)
    return desc
  },
  _decodeHTML: function (body) {
    if (body.indexOf('content="text/html; charset=big5"') > -1) {
      body = iconv.decode(body, 'BIG5')
    }
    //console.log(body)
    return body
  }
}

window.CrawlerManager = CrawlerManager