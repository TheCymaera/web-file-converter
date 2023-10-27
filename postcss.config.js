import tailwind from 'tailwindcss'
//import tailwindNesting from 'tailwindcss/nesting/index.js'
//import nesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'
export default {
    plugins: [/*tailwindNesting(nesting()),*/ tailwind(),autoprefixer]
}