### 是否能使用正则表达式来定义某个类型
- TS的类型主要用于编译时的静态检查而非运行时的验证，所以不可行
- 4.1引入的模板字面量类型可以用于简单的字符串的模式匹配
  ```ts
  type Email = `${string}@${string}.${string}`
  const validEmail: Email = 'banana@example.com' // 通过
  const invalidEmail: Email = 'skdkd' // 报错
  ```