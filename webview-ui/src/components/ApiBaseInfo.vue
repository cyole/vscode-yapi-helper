<script setup lang="ts">
import type { ApiInfo } from '~/types'
import dayjs from 'dayjs'

const props = defineProps<{
  apiInfo?: ApiInfo
}>()

const message = useMessage()
const { copy } = useClipboard()

function copyPath() {
  copy(props.apiInfo?.path || '')
  message.success('复制成功')
}
</script>

<template>
  <NDescriptions :column="2" bordered label-placement="left">
    <NDescriptionsItem label="接口名称">
      <NText>{{ apiInfo?.title }}</NText>
    </NDescriptionsItem>

    <NDescriptionsItem label="创建人">
      <NFlex align="center">
        <NAvatar :src="apiInfo?.user_avatar" />
        <NText>{{ apiInfo?.username }}</NText>
      </NFlex>
    </NDescriptionsItem>

    <NDescriptionsItem label="状态">
      <NFlex align="center">
        <NBadge dot :type="apiInfo?.status === 'done' ? 'success' : 'error'" />
        <NText>{{ apiInfo?.status === 'done' ? '已完成' : '未完成' }}</NText>
      </NFlex>
    </NDescriptionsItem>

    <NDescriptionsItem label="更新时间">
      <NText>{{ apiInfo?.up_time ? dayjs(apiInfo?.up_time * 1000).format('YYYY-MM-DD HH:mm:ss') : '--' }}</NText>
    </NDescriptionsItem>

    <NDescriptionsItem label="接口路径" :span="2">
      <NFlex align="center">
        <NTag
          :bordered="false"
          :type="apiInfo?.method.toLowerCase() === 'post' ? 'success' : 'info'"
        >
          <NText>{{ apiInfo?.method.toUpperCase() }}</NText>
        </NTag>
        <NText type="primary" class="cursor-pointer" @click="copyPath">
          {{ apiInfo?.path }}
        </NText>
      </NFlex>
    </NDescriptionsItem>
  </NDescriptions>
</template>
