import type { YapiApiData } from './views/api'
import { defineExtension, useCommand } from 'reactive-vscode'
import { logger } from './utils'
import { useApiTreeView } from './views/api'
import { useApiDetailView } from './views/api-detail'

const { activate, deactivate } = defineExtension((context) => {
  logger.info('Extension 启动成功')

  useCommand('api-helper.viewApiDetail', async (...args: any[]) => {
    const api = args[0] as YapiApiData
    useApiDetailView(context, api)
  })

  useApiTreeView()
})

export { activate, deactivate }
