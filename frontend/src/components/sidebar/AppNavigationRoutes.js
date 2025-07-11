const AppNavigationRoutes = {
    root: {
        name: '/',
        displayName: 'navigationRoutes.home',
    },
    routes: [
        {
            name: 'dashboard',
            displayName: 'menu.dashboard',
            meta: {
                icon: 'dashboard',
            },
        },
        {
            name: 'preferences',
            displayName: 'menu.preferences',
            meta: {
                icon: 'manage_accounts',
            },
        },
        {
            name: 'settings',
            displayName: 'menu.settings',
            meta: {
                icon: 'settings',
            },
        }
    ],
}

export default AppNavigationRoutes
