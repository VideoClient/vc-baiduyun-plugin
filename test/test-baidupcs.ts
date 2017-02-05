import 'mocha'
import * as chai from 'chai'
const chaiAsPromised = require('chai-as-promised');

import {BaiduPCSClient} from '../baidupcs'

let client = new BaiduPCSClient();

chai.should();
chai.use(chaiAsPromised);


describe('BaiduYun Test', function () {
    this.timeout(30000)
    it('should get fastest host', function() {
        return client.get_fastest_pcs_server().should.eventually.exist;
    })

    it('should get fastest host by test', function() {
        return client.get_fastest_pcs_server_test().should.eventually.exist;
    })

    it('should get token', function() {
        return client.get_token().should.eventually.exist;
    })
})