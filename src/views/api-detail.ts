import type { Webview, WebviewPanel } from 'vscode'
import type { ApiInfo } from '../../webview-ui/src/types'
import type { YapiApiData } from './api'
import getHtml from '@tomjs/vscode-extension-webview'
import { extensionContext, useWebviewPanel } from 'reactive-vscode'
import { ExtensionMode, ViewColumn } from 'vscode'
import { config } from '../config'
import { apiDetail } from '../constants/api'
import { getUri, logger, request, uuid } from '../utils'

const openedPanelMap = new Map<string, WebviewPanel>()

export async function useApiDetailView(apiData: YapiApiData) {
  const context = extensionContext.value!
  const isDev = context.extensionMode !== ExtensionMode.Development

  function getWebviewContent(webview: Webview) {
    const stylesUri = getUri(webview, context.extensionUri, ['dist', 'webview-ui', 'assets', 'index.css'])
    const scriptUri = getUri(webview, context.extensionUri, ['dist', 'webview-ui', 'assets', 'index.js'])

    const nonce = uuid()

    if (isDev) {
      return getHtml({ serverUrl: 'http://localhost:5173' })
    }

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /* html */ `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>API Helper Webview</title>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `
  }

  if (openedPanelMap.has(apiData._id)) {
    openedPanelMap.get(apiData._id)?.reveal(ViewColumn.Active)
    return
  }

  const { panel } = useWebviewPanel(
    `yapiHelperDetailView-${apiData._id}`,
    `API: ${apiData.title}`,
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

  panel.webview.html = getWebviewContent(panel.webview)

  if (openedPanelMap.size > 5) {
    const firstKey = openedPanelMap.keys().next().value as string
    openedPanelMap.get(firstKey)?.dispose()
    openedPanelMap.delete(firstKey)
  }

  openedPanelMap.set(apiData._id, panel)
  panel.onDidDispose(() => {
    openedPanelMap.delete(apiData._id)
  })

  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.type === 'getApiInfo') {
      const apiInfo = await request<ApiInfo>(`${config.yapiBaseUrl}${apiDetail}`, {
        id: apiData._id,
        token: apiData.project_token || '',
      })

      panel.webview.postMessage({
        type: message.type,
        data: {
          ...apiInfo,
          user_avatar: `${config.yapiBaseUrl}/api/user/avatar?uid=${apiInfo.uid}`,
          req_body_schema: JSON.parse(apiInfo.req_body_other || '{}'),
          res_body_schema: JSON.parse(apiInfo.res_body || '{}'),
        },
      })
    }
  })
}
