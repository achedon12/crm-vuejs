const Urls = {
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        register: '/auth/register',
        updatePassword: '/auth/update-password',
    },
    tasks: {
        realm: '/task/realm/',
        new: 'task',
        get: '/task/',
        update: '/task/',
        delete: '/task/',
    },
    account: {
        update: '/user/',
        get: '/user/',
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
