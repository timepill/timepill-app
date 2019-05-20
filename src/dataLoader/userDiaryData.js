import Api from '../util/api'


const PAGE_SIZE = 21;

export default class UserDiaryData {

    constructor(userId = 0) {
        this.userId = userId;
    }

    async refresh() {
        if(this.userId === 0) {
            let user = await Api.getSelfInfoByStore();
            this.userId = user.id;
        }

        let list = await Api.getUserTodayDiaries(this.userId);
        return {
            list,
            more: false
        };
    }
}