const FRMessages = {
    menu: {
        realms: 'Royaumes',
        dashboard: 'Tableau de bord',
        tasks: 'Tâches',
        preferences: 'Préférences',
        realmAdministration: 'Administration du royaume',
        settings: 'Paramètres',
        logout: 'Se déconnecter',
        welcome: 'Bienvenue',
    },
    task: {
        edit: {
            title: 'Détails de la tâche',
            state: 'État',
            priority: 'Priorité',
            createdAt: 'Créé le',
            updatedAt: 'Mis à jour le',
            assignedAt: 'Assigné le',
            dueDate: 'Date d\'échéance',
            history: 'Historique',
            activity: 'Activité',
            comments: 'Commentaires',
            addComment: 'Ajouter un commentaire',
            commentPlaceholder: 'Écrivez votre commentaire ici...',
            noDescription: 'Aucune description fournie pour cette tâche.',
            noDueDate: 'Aucune date d\'échéance définie pour cette tâche.',
            noAssignedAt: 'Cette tâche n\'est assignée à personne.',
            created: '{user} a créé la tâche.',
            updated: '{user} a mis à jour la tâche.',
            assigned: '{user} a assigné la tâche.',
            unassigned: '{user} a désassigné la tâche.',
            stateChanged: '{user} a changé l\'état en {state}.',
            titleChanged: '{user} a changé le titre en "{title}".',
            unknown: 'Action inconnue.',
        }
    },
    settings: {
        title: 'Paramètres',
        notifications: {
            title: 'Notifications',
            description: 'Gérez vos préférences de notification.',
            switchSuccess: 'Paramètres de notification mis à jour avec succès.',
        },
        category: {
            theme: 'Thème',
            language: 'Langue',
            notifications: 'Notifications',
        }
    },
    form: {
        field: {
            firstname: 'Prénom',
            lastname: 'Nom de famille',
            password: 'Mot de passe',
            email: 'Email',
        },
        required: {
            allFields: 'Tous les champs sont obligatoires.',
        },
        invalid: {
            passwords: 'Les mots de passe ne correspondent pas.',
        }
    },
    preferences: {
        emailSubscriptions: {
            title: 'Abonnements par e-mail',
            manage: 'Pour gérer les e-mails que vous recevez, visitez les',
            route: 'Paramètres de notification',
        },
        resetPassword: {
            oldPassword: 'Ancien mot de passe',
            newPassword: 'Nouveau mot de passe',
            repeatNewPassword: 'Répéter le nouveau mot de passe',
            conditions: {
                minLength: 'Le mot de passe doit comporter au moins 8 caractères.',
                uniqueChars: 'Le mot de passe doit contenir au moins 6 caractères uniques.',
            }
        }
    },
    loading: {
        message: 'Chargement, veuillez patienter...',
        subMessage: 'Cela peut prendre quelques secondes.',
    },
    toast: {
        updateSuccessfully: 'Mis à jour avec succès.',
        deleteSuccessfully: 'Supprimé avec succès.',
        saveSuccessfully: 'Enregistré avec succès.',
        uploadFailed: 'Échec du téléchargement du fichier.',
        uploadSuccess: 'Fichier uploadé avec succès.',
    },
    action: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
        update: 'Mettre à jour',
        confirm: 'Confirmer',
        resetPassword: 'Réinitialiser le mot de passe',
        changePassword: 'Changer le mot de passe',
    }
}

export default FRMessages