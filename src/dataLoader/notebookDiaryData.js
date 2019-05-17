import Api from '../util/api'


const PAGE_SIZE = 21;

export default class NotebookDiaryData {
    
    page: 1;
    list: [];

    async refresh(notebookId, loadMore = false) {
        let page = !loadMore ? 1 : this.page + 1;
        let data = await Api.getNotebookDiaries(notebookId, page, PAGE_SIZE);
        let more = data.items.length === PAGE_SIZE;

        if(!loadMore) {
            this.page = page;
            this.list = data.items.slice(0, PAGE_SIZE - 1);

        } else if(data.items.length > 0) {
            this.page = page;
            this.list = this.list.concat(data.items.slice(0, PAGE_SIZE - 1));
        }

        return {
            list: this.list,
            more
        };
    }
}