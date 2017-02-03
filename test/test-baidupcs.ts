import 'mocha'
import * as chai from 'chai'
const chaiAsPromised = require('chai-as-promised');

import {BaiduPCSClient} from '../baidupcs'

let client = new BaiduPCSClient();

chai.should();
chai.use(chaiAsPromised);


describe('BaiduYun Test', function () {
    it('should get fastest host', function() {
        return client.get_fastest_pcs_server().should.eventually.exist;
    })

    it('should get fastest host by test', function() {
        return client.get_fastest_pcs_server_test().should.eventually.exist;
    })
})