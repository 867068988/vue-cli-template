import _ from 'lodash'
import axios from 'axios'
import stringify from 'qs/lib/stringify'
import dateFns_format from 'date-fns/format'
import download from './download'

export {
  download, // 附件下载
}

/**
 * 时间格式化
 * @param {string | number | Date} date
 * @param {string} [format] 官方文档：https://date-fns.org/v1.30.1/docs/format#description
 * @example dateFormat('YYYY年MM月DD日 HH时mm分ss秒SSS毫秒 Z时区 Q季度 X秒时间戳 x毫秒时间戳')
 */
export const dateFormat = function(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  if (format === '@iso') format = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  return dateFns_format(date, format)
}

/**
 * 将对象序列化成参数
 * @param {object} data
 * @param {Parameters<qs.stringify>[1]} [options]
 */
export const qsStringify = function(data, options) {
  options = { arrayFormat: 'repeat', ...options }
  return stringify(data, options)
}

/**
 * 将对象转成 formData
 * @typedef {string | number | boolean | File | Blob} Val
 * @param {{[key: string]: Val | Val[]}} data
 * @param {'repeat' | 'brackets' | 'indices'} [arrayFormat]
 */
export const toFormData = function(data, arrayFormat = 'repeat') {
  if (data instanceof FormData) return data
  const formData = new FormData()
  _.each(data, (val, key) => {
    if (val === undefined) return
    if (Array.isArray(val)) {
      val = val.filter(v => v !== undefined)
      val.forEach((v, i) => {
        let k = key
        if (arrayFormat === 'brackets') k += '[]'
        else if (arrayFormat === 'indices') k += `[${i}]`
        formData.append(k, v === null ? '' : v)
      })
    } else {
      formData.append(key, val === null ? '' : val)
    }
  })
  return formData
}

/**
 * 判断是否为 axios 取消的请求
 */
export const isCancel = axios.isCancel
