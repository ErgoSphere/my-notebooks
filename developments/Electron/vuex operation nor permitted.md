## electron vuex operation not permitted (200724 update)

---
由工具运行权限引起，修改```package.json```启用管理员权限运行
```json
{
  "win": {
    "requestedExecutionLevel": "requireAdministrator"
  }
}
```