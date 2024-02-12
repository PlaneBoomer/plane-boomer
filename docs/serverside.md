# 后端接口文档
## 整体设计
1. 后端往前端通信使用`websocket`，基于`Ably SDK`，后端推送直接调用`Ably SDK`提供的的[REST API](https://ably.com/docs/api/rest-sdk?lang=javascript)，消息通过`Ably SDK`发送到Ably托管websocket通道，然后再推送到前端；
2. 前端往后端发送消息不通过`websocket`通信，直接调用托管在`Vercel`上的`serverless`服务的`REST`接口。
## 前后端实时通讯接口
### 消息协议
应用层消息通信使用`JSON`通信（后期需要优化性能可以改为其他二进制协议），消息基本结构：
```json
{
    "command":"${command_content}",
    "body": {

    }
}
```
- command_content：用于表示当前操作命令的类型，目前分为：
  - sync：预留，前端往后端传送，用于前后端心跳同步，作用是进行连接管理用（防止前端断开连接后，后端会话没有及时回收导致的内存泄露等问题，暂时可以不用开发），此时`body`为时间戳，具体如下：
    ```json
    {
        "command": "sync",
        "body": {
            "timestamp": 1707702451080
        }
    }
    ```
  - change：一方飞机位置变更之后通知到另外一方，此时`body`为变更之后的位置信息描述，具体如下：
    ```json
    {
        "command": "change",
        "body": {
            "position": {
                "addressA": ["positionA", "positionB"],
                "addressB": ["positionA", "positionB"]
            }
        }
    }
    ```
### 消息通信接口
暂无
## 前后端 REST 请求接口
### 管理接口
- 房间上线：建立房间之后，需要前端调用后端接口，告知房间基本信息
  - URL：`/rest/plane-boomer/room/${room_id}`
  - method：`POST`
  - request body：
    ```json
    {
        "players": ["addressA", "addressB"],
        "playersInfo": {
            "addressA": {
                "planes": ["positionA", "positionB", "positionC"],
                },
            "addressB": {
                "planes": ["positionA", "positionB", "positionC"],
            },
        },
        "bet": 10,
        "first": "addressA"
    }
    ```
  - 解释：
    1. room_id 为 websocket 建立之后的 channel_id；
    2. 其余信息为房间初始化的时候相关内容；
- 房间信息获取：房间详细信息获取接口，前端通过该接口获取房间详细信息，也就是房间当前信息，与上一个接口不同的点在于，position 为当前最新的位置数据
  - URL：`/rest/plane-boomer/room/${room_id}`
  - method：`GET`
  - response body：
    ```json
    {
        "players": ["addressA", "addressB"],
        "playersInfo": {
            "addressA": {
                "planes": ["positionA", "positionB", "positionC"],
                },
            "addressB": {
                "planes": ["positionA", "positionB", "positionC"],
            },
        },
        "bet": 10,
        "first": "addressA"
    }
    ```
    - 解释：
      1. room_id 为 websocket 建立之后的 channel_id；
      2. 其余信息为房间初始化的时候相关内容；
- 房间列表展示：房间列表展示接口，显示当前一共有多少房间
  - URL：`/rest/plane-boomer/roomlist`
  - method: `GET`
  - response body:
    ```json
    {
        "room_id1": {
            "players": ["addressA", "addressB"]
        },
        "room_id2": {
            "players": ["addressA", "addressB"]
        }
    }
    ```
  - 解释：显示当前房间列表数，以及当前的游戏成员，用于展示当前游戏房间
- 房间销毁：游戏结束之后房间销毁接口，需要销毁游戏房间
  - URL：`/rest/plane-boomer/room/${room_id}`
  - method：`DELETE`
  - response body：
    ```json
    {
        "msg": "success"
    }
    ```
    - 解释：删除某个 ID 的房间，返回销毁成功状态（可以不关注，关注成功响应码 200 即可）

### 游戏操作接口