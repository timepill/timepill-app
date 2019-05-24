import {Platform, Dimensions} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import {isIphoneX} from 'react-native-iphone-x-helper'

import TokenManager from './token'


const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';
const DEVICE_WINDOW = Dimensions.get('window')

const OS = DeviceInfo.getSystemName();
const OS_VERSION = DeviceInfo.getSystemVersion();
const DEVICE_ID = DeviceInfo.getUniqueID();
const VERSION = DeviceInfo.getVersion();

const IS_IPHONEX = isIphoneX();


const baseUrl = 'http://open.timepill.net/api';


async function login(username, password) {
    const token = TokenManager.generateToken(username, password);
    await TokenManager.setUserToken(token);

    try {
        const userInfo = await getSelfInfo();

        await TokenManager.setUserInfo(userInfo);
        await TokenManager.setLoginPassword('');

        return userInfo;

    } catch(err) {
        await TokenManager.setUserToken('');
        if (err.code && err.code === 401) {
            return false;
        }

        throw err;
    }
}

async function getSelfInfo() {
    return call('GET', '/users/my');
}

async function getSelfInfoByStore() {
    return await TokenManager.getUserInfo();
}

async function getUserInfo(id) {
    return call('GET', '/users/' + id)
}

async function getTodayDiaries(page = 1, page_size = 20, first_id = '') {
    return call('GET', '/diaries/today?page=' + page + '&page_size=' + page_size + `&first_id=${first_id}`)
        .then((json) => {
            json.page = Number(json.page);
            json.page_size = Number(json.page_size);

            return json;
        });
}

async function getFollowDiaries(page = 1, page_size = 20, first_id = '') {
    return call('GET', '/diaries/follow?page=' + page + '&page_size=' + page_size + `&first_id=${first_id}`)
        .then((json) => {
            json.page = Number(json.page);
            json.page_size = Number(json.page_size);

            return json;
        });
}

async function getNotebookDiaries(id, page, page_size) {
    return call('GET', '/notebooks/' + id + '/diaries?page=' + page + '&page_size=' + page_size, null, 30000)
            .then((json) => {
                json.page = Number(json.page);
                json.page_size = Number(json.page_size);

                return json;
            });
}

async function getUserTodayDiaries(userId) {
    return call('GET', '/users/' + userId + '/diaries/');
}

async function getDiaryComments(diaryId) {
    return call('GET', '/diaries/' + diaryId + '/comments')
}

async function deleteComment(id) {
    return call('DELETE', '/comments/' + id)
}

async function getSelfNotebooks() {
    return call('GET', '/notebooks/my')
}

async function getUserNotebooks(id) {
    return call('GET', '/users/' + id + '/notebooks')
}

async function getRelationUsers(page, page_size) {
    return call('GET', `/relation?page=${page}&page_size=${page_size}`);
}

async function getRelationReverseUsers(page, page_size) {
    return call('GET', `/relation/reverse?page=${page}&page_size=${page_size}`);
}

async function getRelation(user_id) {
    return call('GET', '/relation/' + user_id);
}

async function deleteFollow(user_id) {
    return call('DELETE', '/relation/' + user_id);
}

async function deleteFollowBy(user_id) {
    return call('DELETE', '/relation/reverse/' + user_id);
}

async function addFollow(user_id) {
    return call('POST', '/relation/' + user_id);
}


async function getMessagesHistory() {
    return call('GET', '/tip/history');
}

async function deleteDiary(id) {
    return call('DELETE', '/diaries/' + id);
}


async function updateNotebookCover(bookId, photoUri) {
    return upload('POST', `/notebooks/${bookId}/cover`, {
        cover: {
            uri: photoUri,
            name: 'image.jpg',
            type: 'image/jpg'
        }
    });
}

async function createNotebook(subject, description, expired, privacy) {
    return call('POST', '/notebooks', {
        subject: subject,
        description: description,
        expired: expired,
        privacy: privacy
    });
}

async function updateNotebook(id, subject, description, privacy) {
    return call('PUT', '/notebooks/' + id, {
        subject: subject,
        description: description,
        privacy: privacy
    });
}

async function deleteNotebook(id) {
    return call('DELETE', '/notebooks/' + id)
}

async function report(user_id, diary_id) {
    return call('POST', '/reports/', {
        user_id: user_id,
        diary_id: diary_id,
    });
}


async function upload(method, api, body) {
    let token = await TokenManager.getToken();
    let formData = new FormData();
    for(let prop of Object.keys(body)) {
        formData.append(prop, body[prop]);
    }
    
    return timeout(
        fetch(baseUrl + api, {
            method: method,
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-TP-OS': OS,
                'X-TP-OS-Version': OS_VERSION,
                'X-TP-Version': VERSION,
                'X-TP-Device-ID': DEVICE_ID,
            },
            body: formData
        })
        .then(checkStatus)
        .then(parseJSON)
        .catch(handleCatch)

    , 60000);
}

async function call(method, api, body, _timeout = 10000) {
    let token = await TokenManager.getUserToken();

    return timeout(fetch(baseUrl + api, {
            method: method,
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-TP-OS': OS,
                'X-TP-OS-Version': OS_VERSION,
                'X-TP-Version': VERSION,
                'X-Device-ID': DEVICE_ID,
            },
            body: body ? JSON.stringify(body) : null
        })
        .then(checkStatus)
        .then(parseJSON)
        .catch(handleCatch)

    , _timeout);
}

async function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;

    } else {
        console.log('http error: ' + response.status + ' ' + response.body);

        let errInfo;
        try {
            errInfo = await response.json();
            console.log(errInfo);

        } catch (err) {
            errInfo = {
                code: 0,
                message: '服务器开小差了 :('
            }
        }

        let error = new Error(errInfo.message, errInfo.code ? errInfo.code : errInfo.status_code);
        error.code = errInfo.code ? errInfo.code : errInfo.status_code;
        
        throw error
    }
}

function timeout(promise, time) {
    return Promise.race([
        promise,
        new Promise(function (resolve, reject) {
            setTimeout(() => reject(new Error('request timeout')), time)
        })
    ]);
}

function parseJSON(response) {
    if (response.headers.get('content-type') === 'application/json') {
        return response.json();

    } else {
        return response.text();
    }
}

function handleCatch(err) {
    if (err.message === 'Network request failed') {
        throw new Error('网络连接失败', err.id)
    } else {
        throw err;
    }
}


export default {
    IS_ANDROID,
    IS_IOS,
    DEVICE_WINDOW,
    OS,
    OS_VERSION,
    DEVICE_ID,
    VERSION,
    IS_IPHONEX,

    login,
    getSelfInfoByStore,
    getUserInfo,

    getTodayDiaries,
    getFollowDiaries,
    getNotebookDiaries,
    getUserTodayDiaries,
    deleteDiary,
    
    getDiaryComments,
    deleteComment,
    
    getSelfNotebooks,
    getUserNotebooks,
    
    getRelationUsers,
    getRelationReverseUsers,
    getRelation,
    deleteFollow,
    deleteFollowBy,
    addFollow,

    getMessagesHistory,

    updateNotebookCover,
    createNotebook,
    updateNotebook,
    deleteNotebook,

    report
}