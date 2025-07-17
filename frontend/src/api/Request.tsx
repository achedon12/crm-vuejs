import api from '@/api/index.js'

const Request = () => {

    const get = async (url: string) => {
        try {
            return api
                .get(url)
                .then((response: any) => response)
                .catch((error: any) => error.response)
        } catch (error) {
            console.error('error', error)
        }
    }

    const put = async (url: string, data = {}) => {
        try {
            return api
                .put(url, data)
                .then((response: any) => response.data)
                .catch((error: any) => error.response.data)
        } catch (error) {
            console.error('error', error)
        }
    }

    const imageExists = async (url: string) => {
        try {
            return api.head(url)
                .then((response: any) => {
                    return response.status === 200
                })
                .catch((error: any) => {
                    if (error.response && error.response.status === 404) {
                        return false
                    }
                    return false
                })
        } catch (error) {
            console.error('error', error)
            return false
        }
    }

    const post = async (url: string, data = {}) => {
        try {
            return api
                .post(url, data)
                .then((response: any) => response.data)
                .catch((error: any) => error.response.data)
        } catch (error) {
            console.error('error', error)
        }
    }

    const upload = async (url: string, data = FormData) => {
        try {
            return api.post(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response: any) => response.data)
                .catch((error: any) => error)
        } catch (error) {
            console.error('error', error)
        }
    }

    const del = async (url: string, data = {}) => {
        try {
            return api
                .delete(url, {
                    data: data,
                })
                .then((response: any) => response.data)
                .catch((error: any) => error.response.data)
        } catch (error) {
            console.error('error', error)
        }
    }

    return {
        get,
        put,
        post,
        del,
        imageExists,
        upload,
    }
}

export default Request