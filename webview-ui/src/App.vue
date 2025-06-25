<script setup lang="ts">
import type { ApiInfo } from './types'

const apiInfo = ref<ApiInfo>()
const [loading, setLoading] = useToggle(true)

async function getApiInfo() {
  setLoading(true)
  try {
    apiInfo.value = await vscodeApi.postAndReceive<ApiInfo>('getApiInfo', {})
    console.log(apiInfo.value)
  }
  finally {
    setLoading(false)
  }
}

onMounted(() => {
  getApiInfo()
})
</script>

<template>
  <AppProvider>
    <NSpin :spinning="loading" class="py-6">
      <NH3 prefix="bar">
        基本信息
      </NH3>

      <ApiBaseInfo :api-info="apiInfo" />

      <NH3 prefix="bar">
        Headers
      </NH3>

      <ApiHeader :data="apiInfo?.req_headers" />

      <NH3 prefix="bar">
        请求参数
      </NH3>

      <ApiTable :data="apiInfo?.req_body_schema" />

      <NH3 prefix="bar">
        返回数据
      </NH3>

      <ApiTable :data="apiInfo?.res_body_schema" />
    </NSpin>
  </AppProvider>
</template>
