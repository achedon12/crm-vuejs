import api from '@/api/index.js'

const Request = () => {

    const mergeBody = (data: Record<string, any>) => {
        const body = new FormData()
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                body.append(key, data[key])
            }
        }
        return body
    }

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

    const imageExists = async (url: string) => {
        try {
            const request = api.head(url)
            return request
                .then((response: any) => {
                    return response.status === 200
                })
                .catch((error: any) => {
                    if (error.response && error.response.status === 404) {
                        return false
                    }
                    console.error('Error checking image existence:', error)
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
                .post(url, mergeBody(data))
                .then((response: any) => response.data)
                .catch((error: any) => error.response.data)
        } catch (error) {
            console.error('error', error)
        }
    }

    const del = async (url: string, data = {}) => {
        try {
            return api
                .delete(url, {
                    data: mergeBody(data),
                })
                .then((response: any) => response.data)
                .catch((error: any) => error.response.data)
        } catch (error) {
            console.error('error', error)
        }
    }

    return {
        get,
        post,
        del,
        imageExists,
    }
}

export default Request