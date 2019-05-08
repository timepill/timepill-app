import Api from '../util/api'


const PAGE_SIZE = 21;

export default class HomeListData {

    list: [];
    last_id: 0;

    async refresh() {
        this.last_id = 0;

        let data = await Api.getTodayDiaries(0, PAGE_SIZE, this.last_id);
        let more = data.diaries.length === PAGE_SIZE;
        this.list = data.diaries.slice(0, PAGE_SIZE - 1);
        this.last_id = more ? data.diaries[PAGE_SIZE - 1].id : 0;

        return {
            list: this.list,
            more
        };
    }

    async load_more() {
        let data = await Api.getTodayDiaries(0, PAGE_SIZE, this.last_id);
        let more = data.diaries.length === PAGE_SIZE;

        if (data.diaries.length > 0) {
            this.list = this.list.concat(data.diaries.slice(0, PAGE_SIZE - 1));
        }
        this.last_id = more ? data.diaries[PAGE_SIZE - 1].id : 0;

        return {
            list: this.list,
            more
        };
    }
}