import type { YapiApiData } from './views/api'
import { defineExtension, useCommand } from 'reactive-vscode'
import { commands } from './generated/meta'
import { useApiTreeView } from './views/api'
import { useApiDetailView } from './views/api-detail'

const { activate, deactivate } = defineExtension(() => {
  useCommand(commands.viewApiDetail, async (...args: any[]) => {
    const api = args[0] as YapiApiData
    useApiDetailView(api)
  })

  useApiTreeView()
})

export { activate, deactivate }
