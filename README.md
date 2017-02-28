# 基于Vue.js的TodoList应用
用Vue.js制作的一个带简单注册登入功能的TodoList应用，依靠leancloud存储用户数据。

##预览地址：[TodoList应用](https://zhoupenghui0913.github.io/Vue-todolist/page.html) 
(服务器本身在国外，当网速不给力时会看到奇怪的画面!)

##Introduction

首先必须在注册表单注册属于你自己的账户，注册失败一般都是账户名已被注册的原因，如果注册成功后会自动进入应用，然后你就可以放心使用它来记录你的todolists了。

数据在每一次触发`keyup.enter`事件后都会保存到leancloud，下次该账户登录依然可以获取上次保存的信息（除非哪天我把leancloud清空了）。


##Usage

```
- $ npm install
- $ webpack
- 打开page.html
```

