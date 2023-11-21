export = root__request;

declare function root__request(opts: any, ...args: any[]): any;

declare namespace root__request {
    const debug: boolean;

    const del: any;

    function defaults(_defs: any): any;

    function get(opts: any, ...args: any[]): any;

    function head(opts: any, ...args: any[]): any;

    function options(opts: any, ...args: any[]): any;

    function patch(opts: any, ...args: any[]): any;

    function post(opts: any, ...args: any[]): any;

    function put(opts: any, ...args: any[]): any;

    type Headers = Record<string, string | string[]>;

    interface RequestOptions {
        body ?: any;
        form ?: any;
        headers ?: Headers;
        method ?: string;
        json ?: boolean | any;
        url: string;
    }

    interface Response {
        body: any;
        headers: Headers;
        ok: boolean;
        response ?: any;
        request ?: any;
        status: string;
        statusCode: number;
    }

    function Request(opts: RequestOptions): Response;
}
