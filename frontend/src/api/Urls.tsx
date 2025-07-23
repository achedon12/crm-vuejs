const Urls = {
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        register: '/auth/register',
        updatePassword: '/auth/update-password',
    },
    realm: {
        assignees: '/realm/{id}/assignees',
    },
    tasks: {
        realm: '/task/realm/',
        new: 'task',
        get: '/task/',
        update: '/task/',
        delete: '/task/',
        comment: {
            new: '/comment',
            get: '/comment/',
            update: '/comment/',
            delete: '/comment/',
        }
    },
    account: {
        update: '/user/',
        create: '/user/create',
        get: '/user/',
        getFromRealm: '/user/realm/',
        delete: '/user/',
    },
    notification: {
        switch: '/notification/switch',
        list: '/notification/list',
    },
    file: {
        upload: '/file/upload',
    }
}

export default Urls
