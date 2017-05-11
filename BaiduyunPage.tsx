import React = require('react')
import {FlatButton, Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui'
const {Box, VBox, Page, Container, ScrollView} = require('react-layout-components')
const {remote} = require('electron')
const BrowserWindow = remote.BrowserWindow
import {BaiduPCSClient} from './baidupcs'
import {App} from '../../ts/Model'

export class BaiduyunPage extends React.Component<any, any> {
    private client = new BaiduPCSClient() 

    login() {
        let new_window = new BrowserWindow({width: 1366, height: 768})
        new_window.loadURL('https://passport.baidu.com/v2/?login')
        new_window.webContents.on('did-get-redirect-request', 
            (event, oldURL, newURL, isMainFram, respcode, request, ref, header) => {
                new_window.close()
        })
    }

    getUserInfo() {
        remote.getCurrentWindow().webContents.session.cookies.get({url: 'https://yun.baidu.com'}, async (error, cookies) => {
            if (error) throw error;
            console.log(cookies)
            let token = await this.client.get_token()
            let BDUSS
            for (let cookie of cookies) {
                if (cookie.name == "BDUSS")
                    BDUSS = cookie.value
            }
            console.log(BDUSS, token)
            this.client.setUsertoken(BDUSS, token, cookies)
            this.client.user_info()
        });
    }

    getQuote() {
        this.client.quota()
    }

    webdisk() {
        let new_window = new BrowserWindow({width: 1366, height: 768})
        new_window.loadURL('file://' + __dirname + '/webyun.html')
        
    }

    render() {
        return<div style={{width: '100%'}}>
            <div className='content-card'>
                <Card>
                    <CardHeader
                        title="百度网盘"
                        actAsExpander={true}
                        showExpandableButton={true}/>
                    <CardText>
                        <FlatButton label='百度登陆' onClick={this.login}></FlatButton>
                        <FlatButton label='Web版网盘' onClick={this.webdisk}></FlatButton>
                        <FlatButton label='用户数据获取' onClick={this.getUserInfo.bind(this)}></FlatButton>
                        <FlatButton label='获取配额' onClick={this.getQuote.bind(this)}></FlatButton>
                    </CardText>
                    <CardText expandable={true}>
                        <Container>
                           
                        </Container>
                    </CardText>
                </Card> 
            </div>
        </div>
    }
}