/* eslint-disable perfectionist/sort-imports */
import '@tomjs/vscode-extension-webview/client'
import { createApp } from 'vue'
import App from './App.vue'

import './style/main.css'
import 'uno.css'

createApp(App).mount('#app')
