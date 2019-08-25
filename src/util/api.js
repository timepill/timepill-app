import {Platform, Dimensions} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import {isIphoneX} from 'react-native-iphone-x-helper'

import Token from './token'


const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';
const DEVICE_WINDOW = Dimensions.get('window')

const OS = DeviceInfo.getSystemName();
const OS_VERSION = DeviceInfo.getSystemVersion();
const DEVICE_ID = DeviceInfo.getUniqueID();
const VERSION = DeviceInfo.getVersion();

const IS_IPHONEX = isIphoneX();


const baseUrl = 'https://open.timepill.net/api';
const v2Url = 'https://v2.timepill.net/api';


async function login(username, password) {
    const token = Token.generateToken(username, password);
    await Token.setUserToken(token);

    try {
        const userInfo = await getSelfInfo();

        await Token.setUserInfo(userInfo);
        await Token.setLoginPassword('');

        return userInfo;

    } catch(err) {
        await Token.setUserToken('');
        if (err.code && err.code === 401) {
            return false;
        }

        throw err;
    }
}

async function logout() {
    Token.setUserToken('');
    Token.setUserInfo(false);
    Token.setLoginPassword('');
}

async function sendRegisterVerificationCode(mobile) {
    return callV2('POST', '/verification/register', {
        'type': 'mobile',
        'sendTo': mobile
    });
}

async function register(nickname, username, password) {
    const result = await call('POST', '/users', {
        name: nickname,
        email: username,
        password: password
    });

    if(result) {
        const token = Token.generateToken(username, password);
        await Token.setUserToken(token);

        const userInfo = await getSelfInfo();
        await Token.setUserInfo(userInfo);
    }

    return result;
}

async function mobileRegister(nickname, mobile, password, code) {
    const result = await callV2('POST', '/users', {
        type: 'mobile',
        name: nickname,
        mobile: mobile,
        password: password,
        code: code
    });

    if(result) {
        const token = Token.generateToken(mobile, password);
        await Token.setUserToken(token);

        const userInfo = await getSelfInfo();
        await Token.setUserInfo(userInfo);
    }

    return result;
}


async function getSplashByStore() {
    try {
        let info = await Token.get('splash');
        console.log('api get splash:', info);
        if(info) {
            const splash = JSON.parse(info);
            
            const now = Date.parse(new Date()) / 1000;
            if((splash.start_time  && splash.start_time > now) ||
                (splash.end_time && now > splash.end_time)) {

                return null;
            }
            
            return splash;
        }
        
    } catch (e) {}

    return null;
}

async function syncSplash() {
    let load = (async () => {
        const splash = await callV2('GET', '/splash');
        await Token.set('splash', JSON.stringify(splash));

        const now = Date.parse(new Date()) / 1000;
        if((splash.start_time  && splash.start_time > now) ||
            (splash.end_time && now > splash.end_time)) {

            return null;
        }

        return splash;
    })();

    let timer = new Promise((resolve, reject) => {
        setTimeout(resolve, 500)
    });

    return Promise.race([load, timer]);
}

async function getSelfInfo() {
    return call('GET', '/users/my');
}

async function getSelfInfoByStore() {
    return await Token.getUserInfo();
}

async function getUserInfo(id) {
    return call('GET', '/users/' + id)
}

async function updateUserIcon(photoUri) {
    return upload('POST', '/users/icon', {
        icon: {uri: photoUri, name: 'image.jpg', type: 'image/jpg'}
    });
}

async function updateUserInfo(name, intro) {
    return call('PUT', '/users', {
        name: name,
        intro: intro
    });
}


async function getTodayDiaries(page = 1, page_size = 20, first_id = '') {
    return call('GET', '/diaries/today?page=' + page + '&page_size=' + page_size + `&first_id=${first_id}`)
        .then((json) => {
            json.page = Number(json.page);
            json.page_size = Number(json.page_size);

            return json;
        });
}

async function getTodayTopicDiaries(page = 1, page_size = 20, first_id = '') {
    return call('GET', `/topic/diaries?page=${page}&page_size=${page_size}&first_id=${first_id}`)
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

async function getTodayTopic() {
    return call('GET', '/topic/');
}


async function getDiaryComments(diaryId) {
    return call('GET', '/diaries/' + diaryId + '/comments');
}

async function deleteComment(id) {
    return call('DELETE', '/comments/' + id);
}

async function addComment(diaryId, content, recipient_id) {
    return call('POST', '/diaries/' + diaryId + '/comments', {
        content: content,
        recipient_id: recipient_id,
    });
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

async function getMessages() {
    return callV2('GET', '/tips');
}

async function getMessagesHistory() {
    return call('GET', '/tip/history');
}

async function deleteMessage(ids) {
    return call('POST', '/tip/read/' + ids.join(','))
}

async function getDiary(id) {
    return call('GET', '/diaries/' + id);
}

async function deleteDiary(id) {
    return call('DELETE', '/diaries/' + id);
}

async function addDiary(bookId, content, photoUri = null, join_topic = null) {
    if(!photoUri) {
        return call('POST', '/notebooks/' + bookId + '/diaries', {
            content,
            join_topic
        });

    } else {
        return upload('POST', '/notebooks/' + bookId + '/diaries', {
            content,
            join_topic,
            photo: {
                uri: photoUri,
                name: 'image.jpg',
                type: 'image/jpg'
            }
        });
    }
}

async function updateDiary(id, bookId, content) {
    return call('PUT', '/diaries/' + id, {
        content,
        notebook_id: bookId
    });
}

async function likeDiary(id) {
    return callV2('PUT', '/like/diaries/' + id);
}

async function cancelLikeDiary(id) {
    return callV2('DELETE', '/like/diaries/' + id);
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

async function margeNotebook(from, to) {
    return callV2('POST', `/notebooks/${from}/marge_to/${to}`);
}

async function report(user_id, diary_id) {
    return call('POST', '/reports/', {
        user_id: user_id,
        diary_id: diary_id,
    });
}

async function feedback(content) {
    return callV2('POST', '/feedback', {content});
}

async function getUpdateInfo() {
    return callV2('GET', '/updateInfo');
}

export async function updatePushInfo() {
    return callV2('POST', '/push');
}


async function upload(method, api, body) {
    let token = await Token.getUserToken();
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
        .catch((err) => {
            err.message += ' api:' + api;
            handleCatch(err);
        })

    , 60000);
}

async function call(method, api, body = null, _timeout = 10000) {
    let token = await Token.getUserToken();
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
        .catch((err) => {
            err.message += ' api:' + api;
            handleCatch(err);
        })
    , _timeout);
}

async function callV2(method, api, body = null, _timeout = 10000) {
    let token = await Token.getUserToken();
    return timeout(fetch(v2Url + api, {
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
        .then((response) => {
            return response;
        })
        .then(checkStatus)
        .then(parseJSON)
        .catch((err) => {
            err.message += ' api:' + api;
            handleCatch(err);
        })
    ,_timeout);
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
    if (err.message.indexOf('Network request failed') >= 0) {
        err.message = err.message.replace('Network request failed', '网络连接失败');
        throw err;
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
    logout,
    sendRegisterVerificationCode,
    register,
    mobileRegister,

    getSplashByStore,
    syncSplash,
    getSelfInfoByStore,
    getUserInfo,
    
    updateUserIcon,
    updateUserInfo,

    getTodayDiaries,
    getTodayTopicDiaries,
    getFollowDiaries,
    getNotebookDiaries,
    getUserTodayDiaries,

    getTodayTopic,

    getDiary,
    deleteDiary,
    addDiary,
    updateDiary,
    likeDiary,
    cancelLikeDiary,
    
    getDiaryComments,
    deleteComment,
    addComment,
    
    getSelfNotebooks,
    getUserNotebooks,
    
    getRelationUsers,
    getRelationReverseUsers,
    getRelation,
    deleteFollow,
    deleteFollowBy,
    addFollow,

    getMessages,
    getMessagesHistory,
    deleteMessage,

    updateNotebookCover,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    margeNotebook,

    report,
    feedback,
    getUpdateInfo,

    updatePushInfo,
}