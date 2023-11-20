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

}
