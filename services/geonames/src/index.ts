import { processGeonames } from '@resettle/processors/intelligence'
import { getIntelligenceDB, getR2 } from '@services/_common'
import { Bot } from 'grammy'

const notify = async (env: Cloudflare.Env, bot: Bot, message: string) => {
  if (env.ENV === 'development') {
    console.log(message)
    return
  }

  await bot.api.sendMessage(env.TELEGRAM_GROUP_CHAT_ID, message)
}

export default {
  async scheduled(_controller, env) {
    const bot = new Bot(env.TELEGRAM_NOTIFICATION_BOT_TOKEN)
    const s3 = getR2(env)
    const { db, pool } = getIntelligenceDB(env)

    try {
      await processGeonames(
        { s3, db },
        { type: 's3', bucket: env.DATA_SNAPSHOTS_BUCKET },
      )
    } catch (e) {
      await notify(env, bot, (e as Error).message)
    } finally {
      await pool.end()
    }
  },
} satisfies ExportedHandler<Cloudflare.Env>
