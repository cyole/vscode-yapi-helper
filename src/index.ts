import type { YapiApiData } from './views/api'
import { defineExtension, useCommand } from 'reactive-vscode'
import { commands } from './generated/meta'
import { useApiTreeView } from './views/api'
import { useApiDetailView } from './views/crabu'

const { activate, deactivate } = defineExtension(() => {
  useCommand(commands.viewApiDetail, async (...args: any[]) => {
    const api = args[0] as YapiApiData

    await fetch(`http://localhost/api/interface/add/${api.project_id}/${api._id}`, { method: 'POST' })
    useApiDetailView(api)
  })

  useApiTreeView()
})

export { activate, deactivate }
