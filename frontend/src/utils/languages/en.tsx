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
        states: {
            submitted: 'Submitted',
            inProgress: 'In Progress',
            completed: 'Completed',
            done: 'Done',
            archived: 'Archived',
        },
        priorities: {
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            critical: 'Critical',
        },
        create: {
            title: 'Create a new task',
        },
        edit: {
            title: 'Task details',
            description: 'Description',
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
            commentSent: 'Comment sent successfully.',
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
            title: 'Title',
            description: 'Description',
            username: 'Username',
            firstname: 'First Name',
            lastname: 'Last Name',
            password: 'Password',
            email: 'Email',
            priority: 'Priority',
            dueDate: 'Due Date',
            assigned: 'Assigned To',
            role: 'Role',
            state: 'State',
            createdAt: 'Created At',
            updatedAt: 'Updated At',
            user: 'User',
            admin: 'Administrator',
        },
        placeholder: {
            title: 'Enter title',
            description: 'Enter description',
            firstname: 'Enter first name',
            lastname: 'Enter last name',
            password: 'Enter password',
            email: 'Enter email address',
            priority: 'Select priority',
            dueDate: 'Select due date',
            assigned: 'Select user to assign',
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
    realmAdministration: {
        userManagement: {
            title: 'User Management',
            gridTitle: 'Realm Users: {count}',
            create: "Create New User",
            view: "User Details",
            delete: "Delete User",
        },
        roleManagement: {
            title: 'Role Management',
        },
    },
    loading: {
        message: 'Loading, please wait...',
        subMessage: 'This may take a few seconds.',
    },
    toast: {
        updateSuccessfully: 'Successfully updated.',
        deleteSuccessfully: 'Successfully deleted.',
        saveSuccessfully: 'Successfully saved.',
        createSuccessfully: 'Successfully created.',
        uploadFailed: 'File upload failed.',
        uploadSuccess: 'File uploaded successfully.',
        loadingUnsuccessfully: 'Failed to load data.',
        deleteConfirmTitle: "Confirm Deletion",
        deleteConfirmText: "Are you sure you want to delete this user? This action cannot be undone.",
        deleteSuccessTitle: "User Deleted",
        deleteSuccessText: "User has been successfully deleted.",
        deleteErrorTitle: "Deletion Error",
        deleteErrorText: "An error occurred while deleting the user. Please try again.",
    },
    action: {
        send: 'Send',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        update: 'Update',
        confirm: 'Confirm',
        resetPassword: 'Reset Password',
        changePassword: 'Change Password',
    },
    error: {
        generic: 'An error occurred. Please try again later.',
    },
    common: {
        confirm: "Confirm",
        cancel: "Cancel",
    }
}
export default ENMessages