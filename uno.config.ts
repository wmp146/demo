import { defineConfig } from 'unocss'
import type { UserConfig } from 'unocss'
const config: UserConfig = {
  // ... 你的配置
  theme: {
    colors: {
      primary: '#3366FF',
      secondary: '#FF6633',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
    },
  },
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'flex-start': 'flex justify-start items-center',
    },
  ],
}
export default defineConfig(config)
