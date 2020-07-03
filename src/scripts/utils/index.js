import _ from 'lodash'
import dateFns_format from 'date-fns/format'

/**
 * 时间格式化
 * @param {Date | string | number} date
 * @param {string} [format]
 */
export const formatTime = function(date, format = 'YYYY-MM-DD HH:mm') {
  try {
    return dateFns_format(date, format)
  } catch (error) {
    return date
  }
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
