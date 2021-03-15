const axios = require("axios");
const catalogModel = require("./models/catalog");
const itemModel = require("./models/catalog");
const { ALPN_ENABLED } = require("constants");
const { request } = require("https");
const API_PATHS = {
    auth:                   "/auth",
    resources:              "/resources",
    resource:               "/resource",
    resourceAdd:           "/resource/add",
    resourceCatalog:        "/resource/catalog",
    resourceCatalogAdd:     "/resource/catalog/add",
    resourceCatalogItem:    "/resource/catalog/item",
    resourceCatalogItemAdd: "/resource/catalog/item/add",
    getItemStruct: "/resource/get_item_struct",

    
};
class MuAPICli {
    constructor(pub_key, prev_key, resource, resource_url,host, port = 80) {
        this.pub_key  = pub_key;
        this.prev_key = prev_key;
        this.resource = resource;
        this.resource_url = resource_url;
        this.inst = axios.create({
            baseURL: host + ":" + port,
        });
        (async () => {
            await this.init();
        })();
        
    }

    async init( ) {
        let res = await this.auth();
        if (res.success) {
            let res2 = await this.resourceAdd(this.resource, this.resource_url);
            if (res2.success) {
                return true;
            } else {
                throw new Error(res2);
            }
        } else {
            throw new Error(`Error auth: ${res}`)
        }
    }

    createOptions(additionals = {}) {
        let baseOpt = {
            public_key: this.pub_key,
        };
        let opt = Object.assign(baseOpt, additionals);
        return opt;
    }

    auth() {
        let data = {};
        return this.request2API(API_PATHS.auth, this.createOptions(), data)
    }

    resources(meta = "") {
        let data = {};
        return this.request2API(API_PATHS.resources, this.createOptions(), data, meta);
    }

    resourceGet(meta = "") {
        let data = {"resource": this.resource};
        return this.request2API(API_PATHS.resource, this.createOptions(), data, meta);
    }

    resourceAdd(name, url, meta = "") {
        let data = {resource: {name: name, url: url}};
        return this.request2API(API_PATHS.resourceAdd, this.createOptions(), data, meta);
    }

    resourceCatalog(meta = "") {
        let data = {resource: this.resource, catalog: {}};
        return this.request2API(API_PATHS.resourceCatalog, this.createOptions(), data, meta);
    }

    resourceCatalogAdd(name, url, region, other = {}, meta = "") {
        let catalog = {name: name, url: url, region: region};
        for (let field in catalogModel) {
            if (other[field]) {
                catalogModel[field] = other[field];
            } else {
                delete catalogModel[field];
            }
        }
        catalog = Object.assign(catalogModel, catalog);
        let data = {"resource": this.resource, "catalog": catalog};
        return this.request2API(API_PATHS.resourceCatalogAdd, this.createOptions(), data, meta);
    }

    resourceCatalogItem(meta = "") {
        let data = {resource: this.resource, item: {}};
        return this.request2API(API_PATHS.resourceCatalogItem, this.createOptions(), data, meta);
    }

    resourceCatalogItemAdd(name, url, region, other = {}, meta = "") {
        let item = {name: name, url: url, region: region};
        for (let field in itemModel) {
            if (other[field]) {
                itemModel[field] = other[field];
            } else {
                delete itemModel[field];
            }
        }
        item = Object.assign(catalogModel, item);

        let data = {resource: this.resource, item: item};
        return this.request2API(API_PATHS.resourceCatalogItemAdd, this.createOptions(), data, meta);
    }

    getItemStruct(item_id, meta = "") {
        let data = {resource: this.resource, item_id: item_id};
        return this.request2API(API_PATHS.getItemStruct, this.createOptions(), data, meta);
    }

    createSign(strData) {
        const hash = require("crypto")
            .createHash("sha256")
            .update(strData + this.prev_key)
            .digest("hex")
            .toLowerCase();
        return hash;
    }

    async request2API(path, opt, data, meta = "") {
        data.time = Math.floor(new Date().getTime() / 1000)
        let strData = JSON.stringify(data);
        opt.data = strData;
        opt.sign = this.createSign(strData);
        try {
            let response = await this.inst.post(path, opt);
            return {success: true, api_response: response.data};
        } catch(err) {
                console.log(err);
                return {success: false, api_response: err.response.data};
        }
    }
}
module.exports = { 
    MuAPICli: MuAPICli
 };