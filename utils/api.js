export default class Api {
    static fetchInternal(url, options, version = "v1") {
        url = process.env.NEXT_PUBLIC_ENDPOINT + version + url;

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        return fetch(url, {
            headers,
            credentials: "include",
            ...options
        })
            .then(response =>
                response.json().then(data => ({
                    data: data,
                    status: response.status
                })));
    }
}
