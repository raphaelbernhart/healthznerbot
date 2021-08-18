import axios from "axios"
import Logger from "./Logger"

const LangCheck = (): boolean => {
    if (process.env.LANGUAGE === 'de' || process.env.LANGUAGE === 'en') {
        return true
    }
    else {
        Logger.error('\x1b[31mLanguage is not configured correctly. Please configure it to "de" or "en"\x1b[0m')
        return false
    }
}

const MemeModeCheck = async (): Promise<boolean> => {
    try {
        await axios.get(`http://api.giphy.com/v1?api_key=${process.env.GIPHY_API_KEY}`)
    } catch(err: any) {
        if (err.response.data.meta.msg !== 'Not Found!') {
            Logger.error('\x1b[31mGiphy API key is not valid. Please get a valid API key to use the Meme Mode (https://support.giphy.com/hc/en-us/articles/360020283431-Request-A-GIPHY-API-Key).\x1b[0m')
            return false
        } else return true
    }
}

const MainCheck = async (): Promise<boolean> => {
    const lang = LangCheck()
    let MemeMode = true
    if (process.env.MEME_MODE === 'true') MemeMode = await MemeModeCheck()

    if (lang && MemeMode) return true
    else {
        process.exit()
    }
}

export default MainCheck