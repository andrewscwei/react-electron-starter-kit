import path from 'path'

export const cwd = path.join(__dirname, '../../')
export const mainSrcDir = path.join(cwd, 'src', 'main')
export const rendererSrcDir = path.join(cwd, 'src', 'renderer')
export const buildDir = path.join(cwd, 'build')
export const localesDir = path.join(cwd, 'config/locales')
