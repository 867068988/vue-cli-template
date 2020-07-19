import _ from 'lodash'
import dateFns_format from 'date-fns/format'

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
 * 将对象转成 formData
 * @typedef {string | number | boolean | File} Val
 * @param {{[key: string]: Val | Val[]}} data
 * @param {'repeat' | 'indices' | 'brackets'} [arrayFormat]
 */
export const toFormData = function(data, arrayFormat = 'repeat') {
  if (data instanceof FormData) return data
  const formData = new FormData()
  _.each(data, (val, key) => {
    if (Array.isArray(val)) {
      val.forEach((v, i) => {
        let k = key
        if (arrayFormat === 'indices') k += `[${i}]`
        else if (arrayFormat === 'brackets') k += '[]'
        formData.append(k, v)
      })
    } else {
      formData.append(key, val)
    }
  })
  return formData
}
