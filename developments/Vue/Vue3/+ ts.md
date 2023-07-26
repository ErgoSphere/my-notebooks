### import component cannot find component its corresponding type declarations.
1. 在目录内新增```shim-vue.d.ts```
    ```ts
    // src/shim-vue.d.ts
    declare module '*.vue' {
      import { ComponentOptions } from 'vue'
      const ComponentOptions: ComponentOptions
      export default ComponentOptions
   }
    ```
2. ```tsconfig.json```
    ```json
    {
      "include": [
        "src/**/*.ts",
        "src/**/*.d.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "src/shims-vue.d.ts"
      ],
      "compilerOptions": {
        "baseUrl": "./",
        "paths": {
          "@/*": ["./src/*"]
        }  
      }
    }
    ```
3. 父组件中
    ```vue
    <script lang="ts" setup>
      import Child from "@views/xxx/xx.vue"
    </script>
    ```