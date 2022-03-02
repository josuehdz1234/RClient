const defineTypeParameters = (parameters) => {
    try {
        if(typeof parameters == "object") {
            if(Array.isArray(parameters)) {
                return parameters.join("/");
            }
            else {
                let uri = [];
                for(let param in parameters) {
                    uri.push(`${param}=${parameters[param]}`);
                }
                return "?" + uri.join("&");
            }
        }
        return parameters;
    }
    catch(err) {
        console.error("This option it's not aviable");
    }
};

const requestMaker = (methods, body, headers) => {
    let request = {method: methods};
    if(!(/get/gi).test(methods) && methods.length > 0) {
        if(typeof body != "object")
            request = {...request, ...{body: JSON.stringify(body || {})}};
        else
            request = {...request, ...{body: form || []}};
    }
    return request;
};

const rclient = (baseURL) => {
    return new Proxy({}, {
        get(_, endpoint) {
            return function ({ url, params: parameters, headers, method }, body) {
                return new Promise( async (resolve, reject) => {
                    try {
                        endpoint = (endpoint == "slug") ? url : endpoint;
                        const parameterMaker = defineTypeParameters(parameters) || "";
                        const methodType = (body != undefined) ? "POST" : "GET";
                        const response = await fetch(`${baseURL}/${endpoint}/${parameterMaker}`, requestMaker(methodType, body, headers));
                        resolve(await response.json());
                    }
                    catch(err) {
                        reject(err);
                    }
                });
            }
        }
    });
};