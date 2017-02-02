import {Video, VideoCollection} from '../../app/ts/Model/resource';
import {ISearchAdapter} from '../../app/ts/Model/res-adapter';

module.exports = vcapi => {

    return {
        'search_adapter': null
    }

}

interface SearchShowResult {
    shows: YoukuVideo[]
    total: string // 总共个数
}

interface YoukuVideo {
    bigPoster: string       // 纵向海报
    bigThumbnail: string    // 横向截屏
    completed: number       // 是否完结
    description: string     // 描述
    episode_count: string   // 总共的剧集
    episode_updated: string // 最新剧集
    episodes: any[7]        // 剧集资源
    hasvideotype: string[]  // 视频类型（正片，预告，资讯，首映式等）
    id: string              // Youku内唯一ID
    link: string            // 剧集链接
    name: string            // 视频名
    paid: number            // 是否需要付费
    play_link: string       // 播放链接
    poster: string          // 小海报
    published: string       // 发布时间
    score: string           // 得分
    showcategory: string    // 类型（电视剧，电影等）
    streamtypes: string[]   // 数据类型（hd2，flv）等
    thumbnail: string       // 小截图
    view_count: string      // 观看次数
}