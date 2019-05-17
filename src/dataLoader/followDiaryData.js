import Api from '../util/api'


const PAGE_SIZE = 21;

export default class FollowDiaryData {
    
    list: [];
    last_id: 0;

    async refresh(loadMore = false) {
        let lastId = !loadMore ? 0 : this.last_id;
        let data = await Api.getFollowDiaries(0, PAGE_SIZE, lastId);
        let more = data.diaries.length === PAGE_SIZE;

        if(!loadMore) {
            this.list = data.diaries.slice(0, PAGE_SIZE - 1);

        } else if(data.diaries.length > 0) {
            this.list = this.list.concat(data.diaries.slice(0, PAGE_SIZE - 1));
        }

        this.last_id = more ? data.diaries[PAGE_SIZE - 1].id : 0;

        return {
            list: this.list,
            more
        };
    }
}