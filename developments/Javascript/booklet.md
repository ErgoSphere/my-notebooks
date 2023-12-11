1. 代码输出结果(refer：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Unary_plus)
   1. ```console.log(1 + "2" + "2") ```: 122
   2. ```console.log(1 + +"2" + "2")```: 32，一元加会尝试将其转为数字，先计算```1+2```，再与```"2"```连接
   3. ```console.log("a" - "b" + "2")```: NaN2, ```"a" + "b"```为NaN，再与```"2"```连接
   4. ```console.log("a" - "b" + 2)```: NaN, ```Nan```+ ```任意数字```=```Nan``` 

---
2. ddd