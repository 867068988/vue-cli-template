import _ from 'lodash'
import axios from 'axios'
import { dateFormat } from './index'
const getDownloadjs = function() {
  const promise = import(/* webpackChunkName: "downloadjs" */ 'downloadjs')
  return promise.then(m => m.default)
}

/**
 * 附件下载，用法参考：https://www.npmjs.com/package/downloadjs
 *
 * @typedef {import('axios').AxiosResponse} AxiosResponse
 * @param {string | File | Blob | Uint8Array | AxiosResponse} data
 * @param {string} [fileName]
 * @param {string} [mimeType]
 * @returns {Promise<void>}
 * @example
 *
 * download(url) // 相当于 a 标签的 href 属性（支持外链）
 *
 * download(axiosResponse)           // 请求时最好配上 responseType，响应头中的附件名规范：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition
 * download(axiosResponse, fileName) // 请求时最好配上 responseType
 *
 * download(file)
 * download(file, fileName)
 *
 * download(data, fileName, 'text/plain')
 * download(data, fileName, 'text/html')
 * ...
 *
 * download(...args)
 *   .then(() => console.log('成功调用下载器'))
 *   .catch(() => console.log('下载失败 | 无法调用下载器'))
 */
export const download = async function(data, fileName, mimeType) {
  const downloadjs = await getDownloadjs()
  const defaultFName = 'download_' + dateFormat(Date.now(), 'YYYYMMDD_HHmmss')
  const createPromise = function(isResolved) {
    return isResolved ? Promise.resolve() : Promise.reject()
  }

  // no data
  if (String(this) === 'true' ? !mimeType : !data) {
    return createPromise(false)
  }

  // callback
  if (String(this) === 'true') {
    const args = [...arguments]
    args[1] = args[1] || defaultFName
    return createPromise(downloadjs.apply(this, args))
  }

  // url
  if (!fileName && !mimeType && data.length < 2048 && !/^data:/.test(data)) {
    const url = data
    const anchor = document.createElement('a')
    anchor.href = url
    /// 同源
    if (anchor.origin === window.location.origin) {
      const axiosIns = axios.create({ responseType: 'blob' })
      return axiosIns.get(url).then(res => {
        fileName = getHeaderFilename(res) || getUrlFilename(url) || defaultFName
        return createPromise(downloadjs(res.data, fileName))
      })
    }
    /// 非同源
    else {
      return createPromise(window.open(url))
    }
  }

  // AxiosResponse
  if (_.has(data, 'data') && _.has(data, 'headers') && _.has(data, 'config')) {
    const res = data
    data = res.data
    fileName =
      fileName ||
      getHeaderFilename(res) ||
      getUrlFilename(_.has(data, 'config.url')) ||
      defaultFName
  }
  // File
  else if (data instanceof File) {
    fileName = fileName || data.name
  }
  // text | Data URLs | Blob | Uint8Array
  else {
    fileName = fileName || defaultFName
  }

  return createPromise(downloadjs(data, fileName, mimeType))
}

const getHeaderFilename = function(res) {
  const disposition = _.get(res, 'headers.content-disposition')
  if (disposition) {
    const reg = /^(.*?;)?\s*filename\s*=\s*["']?(.+?)["']?\s*(;.*)?$/
    const matches = disposition.match(reg)
    if (matches) {
      return decodeURIComponent(matches[2])
    }
  }
  return ''
}
const getUrlFilename = function(url) {
  url = (url || '').replace(/[?#].*$/, '')
  const fileName = url.split(/[/\\]+/).pop()
  if (/\.\w+$/.test(fileName)) {
    try {
      return decodeURI(fileName)
    } catch (err) {
      return fileName
    }
  }
  return ''
}

export default download
