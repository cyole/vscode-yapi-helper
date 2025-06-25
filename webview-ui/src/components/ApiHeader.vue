<script setup lang="tsx">
import type { DataTableColumns } from 'naive-ui'
import type { ApiHeaderItem } from '~/types'

defineProps<{
  data?: ApiHeaderItem[]
}>()

const columns: DataTableColumns<ApiHeaderItem> = [
  {
    key: 'name',
    title: '参数名称',
  },
  {
    key: 'value',
    title: '参数值',
  },
  {
    key: 'required',
    title: '是否必须',
    render: (rowData) => {
      return rowData.required === '1' ? '必须' : '非必须'
    },
  },
  {
    key: 'example',
    title: '示例',
  },
]


</script>

<template>
  <NDataTable
    :columns="columns"
    :data="data"
  />
</template>
