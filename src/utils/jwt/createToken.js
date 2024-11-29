import dontenv from '../../config/dotenv.js'
import jwt from 'jsonwebtoken'

export const createToken = (userId = '') => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, dontenv('SECRETKEY'), {
      // expiresIn: '120000' // 2 min
      // expiresIn: '10m'
      expiresIn: '900000' // 15 min
    }, (err, token) => {
      if (err) {
        reject('token not generated.')
      } else {
        resolve(token)
      }
    })
  })
}

export const createRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, dontenv('REFRESHSECRETKEY'), {
      expiresIn: '1d'
    }, (err, token) => {
      if (err) {
        reject('refrs token not generated.')
      } else {
        resolve(token)
      }
    })
  })
}
