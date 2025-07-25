import type { WebviewPanel } from 'vscode'
import type { YapiApiData } from './api'
import getHtml from '@tomjs/vscode-extension-webview'
import { useWebviewPanel } from 'reactive-vscode'
import { ViewColumn } from 'vscode'

const openedPanelMap = new Map<string, WebviewPanel>()

export async function useApiDetailView(apiData: YapiApiData) {
  function getWebviewContent() {
    return getHtml({ serverUrl: 'http://localhost' })
  }

  if (openedPanelMap.has(apiData._id)) {
    openedPanelMap.get(apiData._id)?.reveal(ViewColumn.Active)
    return
  }

  const { panel } = useWebviewPanel(
    `yapiHelperDetailView-${apiData._id}`,
    `${apiData.title} - Crabu`,
    '',
    {
      viewColumn: ViewColumn.Active,
    },
    {
      enableFindWidget: true,
      retainContextWhenHidden: true,
      webviewOptions: {
        enableScripts: true,
        enableCommandUris: true,
      },
    },
  )

  panel.webview.html = getWebviewContent()

  if (openedPanelMap.size > 5) {
    const firstKey = openedPanelMap.keys().next().value as string
    openedPanelMap.get(firstKey)?.dispose()
    openedPanelMap.delete(firstKey)
  }

  openedPanelMap.set(apiData._id, panel)
  panel.onDidDispose(() => {
    openedPanelMap.delete(apiData._id)
  })
}
