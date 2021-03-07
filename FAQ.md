## 常见问题

<details>
  <summary>使用 vpn 后，可能会导致本地开发环境 ip 识别错误，出现无法热更新等问题，如何解决？</summary>

- 需要内网的其它机器也能访问时
  - 先关闭或挂起 vpn，等本地开发环境启动后，再打开或恢复 vpn
- 仅限本机器访问时（一劳永逸）
  - 方法一 (适用整个团队)：vue.config.js 配置 `devServer.host = 'localhost'`
  - 方法二 (适用个人，优先级高于方法一)：新建 .env.development.local，写入 `HOST = localhost`
    </details>
