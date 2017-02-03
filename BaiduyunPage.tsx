import React = require('react')
import {FlatButton, Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui'
const {Box, VBox, Page, Container, ScrollView} = require('react-layout-components')
const {remote} = require('electron')
const BrowserWindow = remote.BrowserWindow
import {BaiduPCSClient} from './baidupcs'


export class BaiduyunPage extends React.Component<any, any> {
    private client = new BaiduPCSClient() 

    login() {
        let new_window = new BrowserWindow({width: 1366, height: 768})
        new_window.loadURL('https://passport.baidu.com/v2/?login')
        new_window.webContents.on('did-get-redirect-request', 
            (event, oldURL, newURL, isMainFram, respcode, request, ref, header) => {
                remote.getCurrentWindow().webContents.session.cookies.get({domain: '.yun.baidu.com'}, function(error, cookies) {
                if (error) throw error;
                console.log(cookies)
                new_window.close()
            });
        })
    }

    getUserInfo() {
        this.client.user_info()
    }


    webdisk() {
        let new_window = new BrowserWindow({width: 1366, height: 768})
        new_window.loadURL('https://yun.baidu.com/')
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