export interface ApiHeaderItem {
  name: string
  type: string
  example: string
  desc: string
  required: '0' | '1'
}

// TODO:更改为标准 json schema 类型
export interface ApiBodySchema {
  type: string
  $schema: string
  description: string
  default?: string
  required?: string[]
  items?: ApiBodySchema
  enum?: string[]
  minimum?: number
  maximum?: number
  properties: Record<string, ApiBodySchema>
}

export interface ReqParams {
  name: string
  example: string
  desc: string
}

export interface ApiInfo {
  /** 接口id */
  _id: string
  /** 用户id */
  uid: string
  /** 用户头像 */
  user_avatar: string
  /** 用户名 */
  username: string
  /** 项目id */
  project_id: string
  /** 分类id */
  catid: string
  /** 接口名称 */
  title: string
  /** 接口路径 */
  path: string
  /** 接口请求方法 */
  method: string
  /** 接口创建时间 */
  add_time: number
  /** 接口更新时间 */
  up_time: number
  /** 接口返回参数 */
  res_body: string
  res_body_schema?: ApiBodySchema
  /** 请求 form 参数 */
  req_body_schema?: ApiBodySchema
  req_body_other: string
  /** 请求 headers 参数 */
  req_headers?: ApiHeaderItem[]
  /** 接口状态 */
  status: 'done' | 'undone'
  /** 接口标签 */
  tag: string[]
  /** 接口描述 */
  desc: string
  /** 接口返回参数是否是 json schema */
  res_body_is_json_schema?: boolean
}
