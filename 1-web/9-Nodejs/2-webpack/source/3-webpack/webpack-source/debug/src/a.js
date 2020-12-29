// a.js (webpack config 入口文件)
import add from './b.js'
add(1, 2)
import('./c').then(del => del(1, 2))


