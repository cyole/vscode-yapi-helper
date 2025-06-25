<script setup lang="tsx">
import type { DataTableColumns } from 'naive-ui'
import type { ApiBodySchema } from '~/types'

interface ApiTableData {
  name: string
  type: string
  required?: string
  default?: string
  other?: ApiBodySchema
  children?: ApiTableData[]
}

const props = defineProps<{
  data?: ApiBodySchema
}>()

const columns: DataTableColumns<ApiTableData> = [
  {
    key: 'name',
    title: '名称',
  },
  {
    key: 'type',
    title: '类型',
    width: 100,
  },
  {
    key: 'required',
    title: '是否必须',
    width: 100,
  },
  {
    key: 'default',
    title: '默认值',
    width: 100,
  },
  {
    key: 'description',
    title: '备注',
  },
  {
    key: 'other',
    title: '其他信息',
    render: (rowData) => {
      if (rowData.other?.enum) {
        return `枚举值：${rowData.other.enum.join(',')}`
      }

      if (rowData.other?.type === 'number') {
        return `最小值：${rowData.other.minimum || '无'}，最大值：${rowData.other.maximum || '无'}`
      }

      return '--'
    },
  },
]

// TODO: 更改为标准 json schema 类型
function getChildren(data?: ApiBodySchema): ApiTableData[] {
  if (!data?.properties)
    return []

  return Object.entries(data.properties || {}).map(([key, value]) => ({
    name: key,
    type: value.type,
    description: value.description,
    required: data.required?.includes(key) ? '必须' : '非必须',
    default: value.default,
    other: value,
    children: value.type === 'array' ? getChildren(value.items) : getChildren(value),
  }))
}

const data = computed(() => {
  if (!props.data)
    return []

  return getChildren(props.data)
})
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="data"
    default-expand-all
  />
</template>
