import { createPlugin } from '@tauri-store/pinia';
import { createPinia } from 'pinia';
import { createApp } from "vue";
import Root from "./Root.vue";

const app = createApp(Root);
const pinia = createPinia();
pinia.use(createPlugin());

app.use(pinia).mount("#app");
