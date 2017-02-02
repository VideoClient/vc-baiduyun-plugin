import React = require('react')
import {Video, VideoCollection} from '../../app/ts/Model/resource';
import {ISearchAdapter} from '../../app/ts/Model/res-adapter';
import {BaiduyunPage} from './BaiduyunPage'

module.exports = vcapi => {
    return {
        regTab: { showName:"云盘", name:"cloud", com: <BaiduyunPage key='100' />, defaultKey: 100}
    }
}

