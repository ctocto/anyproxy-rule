const localData = '{"hello": "this is local response"}';

module.exports = {
    localResponse: {//修改返回数据为本地数据
        params: {
            statusCode: 200,
            header: {
                'Content-Type': "application/javascript; charset=UTF-8"
            },
            body: localData
        },
        url: ''//
    },
    remotePath: {//修改链接
        params: {
            path: '/alibaba/anyproxy/4.x/rule_sample/sample_modify_request_path.js',
            method: 'GET'
        },
        url: ''//
    },
    protocol: {//修改协议
        params: {
            port: 443,
            protocol: 'https'
        },
        url: ''
    },
    // remoteUrl: {
    //     params: {
    //         url: 'http://wap.ehuodi.com/regionalShuttleApi/rsroutepricecs/selectRouteConfigDetail',//http://10.51.16.77:3007/example/bundle.wxshare.js
    //         methhod: 'GET'
    //     },
    //     url: 'http://waptest.ehuodi.com/regionalShuttleApi/rsroutepricecs/selectRouteConfigDetail'//http://waptest.ehuodi.com/dist/example/bundle.wxshare.6799dd58.js
    // }
    remoteUrl: {//拦截url 替换 其他 url
        params: {
            url: 'http://10.51.16.96:8102/branch_wxJsSdk/webApp/invitationAward/js/register.js',//替换对象，url
            methhod: 'GET',//POST | GET
            type: 'js'//image | js | json
        },
        url: 'http://waptest.ehuodi.com/invitationAward/js/register.js'//拦截对象 urlhttps://wap.ehuodi.com/ownerApp/js/wuhan_breakbulk.js
    }
}
