import request = require('request'); // 主项目中含有request库

async function request_promise<TUriUrlOptions,TOptions extends request.CoreOptions>
        (url: TUriUrlOptions & TOptions): Promise<any>
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
    api_template = `http://${this.BAIDUPAN_SERVER}/api/`      
    pcs_template = `http://${this.BAIDUPCS_SERVER}/rest/2.0/pcs/`               
    private cookieJar = request.jar();                    
    constructor() {
        this.init()
    }

    async init() {
        let fast_pcs = await this.get_fastest_pcs_server()
        if (fast_pcs != null) this.BAIDUPCS_SERVER = fast_pcs
    }

    setUsertoken(BDUSS: string, token: string, cookies) {
        this.user.BDUSS = BDUSS
        this.user.token = token
        for (let cookie of cookies) {
            let nc = request.cookie(`${cookie.name}=${cookie.value};expires=${cookie.expirationDate};path=${cookie.path};`)
            this.cookieJar.setCookie(nc, cookie.domain)
        }
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
                resolve(minhost)
            }) 
        })
    }

    async get_fastest_pcs_server(): Promise<string> {
        let url = 'http://pcs.baidu.com/rest/2.0/pcs/file?app_id=250528&method=locateupload'
        let ret = JSON.parse(await request_promise(url))
        // console.log(ret)
        return ret.host
    }

    async user_info(): Promise<any> {
        let url = 'https://pan.baidu.com/rest/2.0/'
        let ret = await this.baidu_request('membership/user','query', url)
        console.log(ret)
        return ret
    }

    async quota() {
        let ret = await this.baidu_request('quota', 'info')
        console.log(ret)
        return ret
    }

    async get_token() {
        await request_promise({url: 'http://www.baidu.com', jar: this.cookieJar})
        let time = new Date().getTime()
        let url = `https://passport.baidu.com/v2/api/?getapi&tpl=mn&apiver=v3&class=login&tt=${time}&logintype=dialogLogin&callback=0`
        let data:string = await request_promise({url: url, jar: this.cookieJar})
        data = data.replace(/'/g, '\"')
        let ret = JSON.parse(data)
        return ret['data']['token']
    }


    async baidu_request(uri:string, method:string, url?:string, data?:any, files?:any) {
        return new Promise<string>(async (resolve, reject) => {
            let params = {
                'method': method,
                'app_id': "250528",
                // 'app_id': '266719',
                'web': '1', 
                'BDUSS': this.user['BDUSS'],
                't': new Date().getTime(),
                'bdstoken': this.user['token']
            }
            url = this.api_template + uri
            for (let i in data) 
                params[i] = data[i]
                if (uri == 'filemanager' || uri == 'rapidupload' || uri == 'filemetas' || uri == 'precreate')
                    request.post(url, {headers: this.BAIDUPAN_HEADERS, form: params, jar: this.cookieJar}, (err, resp, data) => {
                        console.log(resp)
                        if (!err && resp.statusCode == 200) {
                            resolve(JSON.parse(data))
                        }
                        reject(resp)
                    })
                else 
                    request.get(url, {headers: this.BAIDUPAN_HEADERS, form: params, jar: this.cookieJar}, (err, resp, data) => {
                        console.log(resp)
                        if (!err && resp.statusCode == 200) {
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