import { Settings } from './Settings'

interface ApplicationConstants {
    RUNNING: boolean
    START: number
    PREVIOUS_TIME_STAMP: number
    TARGET_MS: number
    SCALE: number
}
const APPLICATION: ApplicationConstants = {
  RUNNING: true,
  START: 0,
  PREVIOUS_TIME_STAMP: 0,
  TARGET_MS: 1000 / Settings()['target-fps'],
  SCALE: 1
}

export default APPLICATION
