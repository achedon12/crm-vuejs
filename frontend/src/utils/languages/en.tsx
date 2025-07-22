const ENMessages = {
    menu: {
        realms: "Realms",
        dashboard: 'Dashboard',
        tasks: 'Tasks',
        preferences: 'Preferences',
        realmAdministration: 'Realm Administration',
        settings: 'Settings',
        logout: 'Logout',
        welcome: 'Welcome',
    },
    task: {
        edit: {
            title: 'Task details',
            state: 'State',
            priority: 'Priority',
            createdAt: 'Created at',
            updatedAt: 'Updated at',
            assignedAt: 'Assigned at',
            dueDate: 'Due date',
            history: 'History',
            activity: 'Activity',
            comments: 'Comments',
            addComment: 'Add comment',
            commentPlaceholder: 'Write your comment here...',
            noDescription: 'No description provided for this task.',
            noDueDate: 'No due date set for this task.',
            noAssignedAt: 'This task is not assigned to anyone.',
            created: '{user} created the task.',
            updated: '{user} updated the task.',
            assigned: '{user} assigned the task.',
            unassigned: '{user} unassigned the task.',
            stateChanged: '{user} changed the state to {state}.',
            titleChanged: '{user} changed the title to "{title}".',
            unknown: 'Unknown action.',
        }
    },
    settings: {
        title: 'Settings',
        notifications: {
            title: 'Notifications',
            description: 'Manage your notification preferences.',
            switchSuccess: 'Successfully updated notification settings.',
        },
        category: {
            theme: 'Theme',
            language: 'Language',
            notifications: 'Notifications',
        }
    },
    form: {
        field: {
            firstname: 'First Name',
            lastname: 'Last Name',
            password: 'Password',
            email: 'Email',
        },
        required: {
            allFields: 'All fields are required.',
        },
        invalid: {
            passwords: 'Passwords do not match.',
        }
    },
    preferences: {
        emailSubscriptions: {
            title: 'Email Subscriptions',
            manage: 'To manage what emails you get, visit the',
            route: 'Notification Settings',
        },
        resetPassword: {
            oldPassword: 'Old Password',
            newPassword: 'New Password',
            repeatNewPassword: 'Repeat New Password',
            conditions: {
                minLength: 'Password must be at least 8 characters long.',
                uniqueChars: 'Password must contain at least 6 unique characters.',
            }
        }
    },
    loading: {
        message: 'Loading, please wait...',
        subMessage: 'This may take a few seconds.',
    },
    toast: {
        updateSuccessfully: 'Successfully updated.',
        deleteSuccessfully: 'Successfully deleted.',
        saveSuccessfully: 'Successfully saved.',
        uploadFailed: 'File upload failed.',
        uploadSuccess: 'File uploaded successfully.',
    },
    action: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        update: 'Update',
        confirm: 'Confirm',
        resetPassword: 'Reset Password',
        changePassword: 'Change Password',
    }
}
export default ENMessages