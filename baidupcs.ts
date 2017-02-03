import request = require('request'); // 主项目中含有request库


async function request_promise(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        request(url, (err, resp, data) => {
            if (err) reject(resp)
            else resolve(data)
        })
    });
}

export class BaiduPCSClient {
    BAIDUPAN_SERVER = 'pan.baidu.com'
    BAIDUPCS_SERVER = 'pcs.baidu.com'
    BAIDUPAN_HEADERS = {"Referer": "http://pan.baidu.com/disk/home",
                        "User-Agent": "netdisk;4.6.2.0;PC;PC-Windows;10.0.10240;WindowsBaiduYunGuanJia"}


    constructor() {
    }

    setUsertoken(BDUSS, token) {
        this.user.BDUSS = BDUSS
        this.user.token = token
    }

    async get_fastest_pcs_server_test(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            request_promise('https://pcs.baidu.com/rest/2.0/pcs/manage?method=listhost')
            .then(async (ret) => {
                let data = JSON.parse(ret)
                // console.log(data)
                let min = 1000000
                let minhost
                for (let i = 0; i < data.rev; ++i){
                    let host = data.list[i].host
                    // console.log(`http://${host}${data.path}`)
                    try {
                    let t1=new Date().getTime()
                    let ret = await request_promise(`http://${host}${data.path}`)
                    let t2=new Date().getTime()
                    if (t2-t1 < min) { min = t2-t1; minhost = host}
                    } catch(e) {
                    }
                }
                if (minhost == null) reject('can not find host!')
                console.log(minhost)
                resolve(minhost)
            })
        })
    }

    async get_fastest_pcs_server(): Promise<string> {
        let url = 'http://pcs.baidu.com/rest/2.0/pcs/file?app_id=250528&method=locateupload'
        let ret = JSON.parse(await request_promise(url))
        // console.log(ret)
        console.log(ret.host)
        return ret.host
    }

    async user_info(): Promise<any> {
        let url = 'https://pan.baidu.com/rest/2.0/membership/user'
        let ret = await this.baidu_request('query', url)
        console.log(ret)
        return ret
    }

    async baidu_request(method:string, url:string, data?:any, files?:any) {
        return new Promise<string>(async (resolve, reject) => {
            let params = {
                'method': method,
                'app_id': "250528",
                'BDUSS': this.user['BDUSS'],
                't': new Date().getTime(),
                'bdstoken': this.user['token']
            }
            for (let i in data) 
                params[i] = data[i]
            request.post(url, {headers: this.BAIDUPAN_HEADERS, form: params}, (err, resp, data) => {
                if (!err && resp.statusCode == 200) {
                    console.log(data)
                    resolve(JSON.parse(data))
                }
                reject(resp)
            })
        })
    }
    private user:any = {}
    // private username: string
    // private password: string
    private pcs_server: string
}