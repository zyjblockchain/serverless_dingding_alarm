const getRawBody = require('raw-body')
const ChatBot = require('dingtalk-robot-sender')
const robot = new ChatBot({
    // webhook: 'https://oapi.dingtalk.com/robot/send?access_token=869ba36131a4f654c88b7a20e52f594c15c601322c2c3114b506b3c03dea8c55'
    webhook: 'https://oapi.dingtalk.com/robot/send?access_token=dca501177c481cf2d972e22f2c94f9f1f7cacc9f09b4687bfc724a561bf814d0' // 测试webhook
})

module.exports.handler = async function(req, resp, context) {
    // 获取请求body
    getRawBody(req, async function(err,data) {
        const body = JSON.parse(data.toString())
        // 筛选展示详情
        // const key = '#### 问题编号: '+ '['+body.issue.key+'](' + 'http://samyh.f3322.net:8081/browse/'+body.issue.key + ')'+ '\n'
        // const transitionName = '> - 问题状态: '+ body.transition.transitionName + '\n'
        // const stateChanges = '> - 状态转换：'+ body.transition.from_status + ' --> ' +  body.transition.to_status + '\n'
        // const displayName = '> - 处理人: ' + body.user.displayName + '\n'
        // const issuetype = '> - 问题类型：![screenshot]('+body.issue.fields.issuetype.iconUrl+')'+ body.issue.fields.issuetype.name + '\n'
        // const summary = '> - 问题摘要：' + body.issue.fields.summary + '\n'
        // const description = '> - 问题描述：' + body.issue.fields.description + '\n'
        // const emailAddress = '> - Email: ' + body.user.emailAddress + '\n'
        // const comment = '> - 评论：' + body.comment + '\n'
        // const created = '> - 创建时间：'+ body.issue.fields.created+'\n'
        // const updated = '> - 更新时间: '+ body.issue.fields.updated + '\n'

        const head = '#### '+ body.user.displayName + ' ' + body.transition.transitionName + '了 ' + body.issue.fields.issuetype.name +' ' + body.issue.key + '\n'
        const summary1 = '> ' + '['+body.issue.fields.summary+'](' + 'http://samyh.f3322.net:8081/browse/'+body.issue.key + ')  ' +'\n'
        let comment2 = '\n'
        if (body.comment !== '') {
            comment2 = '> 评论：' + body.comment + '  \n'
        }
        const priority = '> priority：' + body.issue.fields.priority.name + '\n'

        // const content = key + transitionName + stateChanges + displayName + issuetype + summary + description +  emailAddress +  comment + created + updated
        const content = head + summary1 + comment2 + priority
        //把获取通过http发送到dingding机器人上去
        await dingding(content)
        // 返回resp
        resp.setStatusCode(200)
        resp.setHeader('content-type', 'application/json')
        resp.send('success')

    })
}

async function dingding(text) {
    let title = 'JIRA消息推送'
    let at2 = {
        "atMobiles": [
            ""
        ],
        "isAtAll": false
    }
    await robot.markdown(title,text,at2)
}

