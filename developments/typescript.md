### 是否能使用正则表达式来定义某个类型
- TS的类型主要用于编译时的静态检查而非运行时的验证，所以不可行
- 4.1引入的模板字面量类型可以用于简单的字符串的模式匹配
  ```ts
  type Email = `${string}@${string}.${string}`
  const validEmail: Email = 'banana@example.com' // 通过
  const invalidEmail: Email = 'skdkd' // 报错
  ```
  
---
### ``interface``和``type``的区别
- 两者都可以用来定义类型
- 扩展和继承
  - ``interface``: ``extends``继承，支持声明合并，同名会自动合并
    ```ts
    interface Fruit {
      name: string
    }
    interface Banana extends Fruit {
      weight(): void
    }
    interface Fruit {
      color: string
    }
    // 合并为 {name: string; color: string;}
    ```
  - ``type``: 通过交叉类型``&``扩展其他, 不支持声明合并，会报错
    ```ts
    type Fruit = {
      name: string;
    }
    type Banana = Fruit & {
      weight(): void
    }
    ```

| 特性           | ``interface`` | ``type``                       | 
|--------------|---------------|--------------------------------|
| 定义对象类型       | ✅             | ✅                              | 
| 定义联合类型``\|`` | ❌             | ✅ `type A = string \| number`` |
| 定义交叉类型``&``  | ❌ （可继承模拟）   | ✅ ``type C = A & B``         | 
| 定义元组         | ❌ (可模拟 ）      | ✅                              | 
| 定义基本类型别名     | ❌             | ✅                              |
| 函数类型         | ✅             | ✅                              | 
