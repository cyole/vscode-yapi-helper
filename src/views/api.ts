import type { TreeViewNode } from 'reactive-vscode'
import type { ScopedConfigKeyTypeMap } from '../generated/meta'
import { createSingletonComposable, extensionContext, ref, useCommand, useTreeView, watchEffect } from 'reactive-vscode'
import { TreeItemCollapsibleState, window } from 'vscode'
import { config } from '../config'
import { apiListMenu } from '../constants/api'
import { commands } from '../generated/meta'
import { logger, request } from '../utils'

export interface YapiApiData {
  title: string
  path: string
  method: string
  _id: string
  project_id: number
  project_token?: string
}

export interface YapiMenuData {
  name: string
  desc?: string
  list: YapiApiData[]
}

type Project = ScopedConfigKeyTypeMap['yapiProjects'][number]

async function getYapiMenuData(projectId?: number, token?: string) {
  if (!projectId || !token) {
    logger.error(`getYapiMenuData: projectId or token is empty, projectId: ${projectId}, token: ${token}`)
    return []
  }

  const data = await request<YapiMenuData[]>(`${config.yapiBaseUrl}${apiListMenu}`, {
    project_id: projectId.toString(),
    token,
  })

  logger.info(`请求getYapiMenuData结束 -> ${projectId}`)

  return data
}

export const useApiTreeView = createSingletonComposable(async () => {
  const roots = ref<TreeViewNode[]>([])

  async function getRootNode(projects: Project[]) {
    return await Promise.all(projects.map(async project => ({
      children: await getChildNodes(project),
      treeItem: {
        label: project.name,
        collapsibleState: TreeItemCollapsibleState.Collapsed,
      },
    })))
  }

  async function getChildNodes(project: Project): Promise<TreeViewNode[]> {
    const data = (await getYapiMenuData(project.id, project.token))
      .filter(item => item.list.length > 0)

    return data.map(item => ({
      treeItem: {
        label: item.name,
        description: item.desc || '',
        collapsibleState: TreeItemCollapsibleState.Collapsed,
      },
      children: item.list.map((item) => {
        item.project_token = project.token
        return {
          treeItem: {
            label: `${item.method.toUpperCase()} ${item.title}`,
            description: item.path || '',
            command: {
              command: commands.viewApiDetail,
              title: 'API Detail',
              arguments: [item],
            },
          },
        }
      }),
    }))
  }

  async function refreshApiTreeView() {
    window.withProgress({
      location: { viewId: 'apiTreeView' },
    }, async (progress) => {
      progress.report({ message: '正在更新API数据...' })
      roots.value = await getRootNode(config.yapiProjects)
      extensionContext.value?.globalState.update('apiTreeView', roots.value)
    })
  }

  watchEffect(async () => {
    const projectList = config.yapiProjects
    const storage = extensionContext.value?.globalState.get<TreeViewNode[]>('apiTreeView')
    if (storage && storage.length === projectList.length) {
      logger.info('从本地缓存中获取数据')
      roots.value = storage
      return
    }

    await refreshApiTreeView()
  })

  useCommand(commands.refreshApiTreeView, refreshApiTreeView)

  return useTreeView(
    'apiTreeView',
    roots,
    {
      showCollapseAll: true,
    },
  )
})
