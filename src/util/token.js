import AsyncStorage from '@react-native-community/async-storage';
var base64 = require('base-64');


class TokenManager {

    generateToken(username, password) {
        return 'Basic ' + base64.encode(username + ":" + password);
    }


    async set(key, value) {
        await AsyncStorage.setItem(key, value);
    }

    async get(key) {
        return await AsyncStorage.getItem(key);
    }


    async setUserToken(token) {
        await this.set('user_token', token);
        this.token = token;
    }

    async getUserToken() {
        if (!this.token) {
            this.token = await this.get('user_token');
        }

        return this.token;
    }

    async setUserInfo(user) {
        await this.set('user_info', JSON.stringify(user));
        this.user = user;
    }

    async getUserInfo() {
        if (!this.user) {
            this.user = JSON.parse(await this.get('user_info'));
        }

        return this.user;
    }

    async setLoginPassword(password) {
        this.set('login_password', password);
    }

    async getLoginPassword() {
        return await this.get('login_password');
    }

    async setUpdateVersion(version) {
        this.set('update_version', JSON.stringify(version));
    }

    async getUpdateVersion() {
        return JSON.parse(await this.get('update_version'));
    }

    async setDraft(content) {
        this.set('draft', JSON.stringify(content));
    }

    async getDraft() {
        return JSON.parse(await this.get('draft'));
    }

    async setTempDraft(content) {
        this.set('temp_draft', JSON.stringify(content));
    }

    async getTempDraft() {
        return JSON.parse(await this.get('temp_draft'));
    }

    async setSetting(name, value) {
        let settings = await this.getSettings();
        settings[name] = value;

        this.set('setting', JSON.stringify(settings));
    }

    async getSetting(name) {
        const settings = await this.getSettings();
        return settings ? (settings[name]) : null;
    }

    async getSettings() {
        let str = await this.get('setting');
        let setting = str && str.length > 0 ? JSON.parse(str) : {};
        
        if (settings['pushMessage'] === undefined) {
            settings['pushMessage'] = true;
        }

        return settings;
    }

}

export default new TokenManager()
