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
            name: 'tasks-list',
            displayName: 'menu.tasks',
            meta: {
                icon: 'assignment',
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
            name: 'realm-administration',
            displayName: 'menu.realmAdministration',
            meta: {
                icon: 'domain',
                requiresAdmin: true,
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
