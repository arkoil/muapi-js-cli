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
    constructor(pub_key, prev_key, resource, host, port = 80) {
        this.pub_key  = pub_key;
        this.prev_key = prev_key;
        this.resource = resource;
        this.inst = axios.create({
            baseURL: host + ":" + port,
        });
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

    resources() {
        let data = {};
        return this.request2API(API_PATHS.resources, this.createOptions(), data);
    }

    resourceGet() {
        let data = {"resource": this.resource};
        return this.request2API(API_PATHS.resource, this.createOptions(), data);
    }

    resourceAdd(name, url) {
        let data = {resource: {name: name, url: url}};
        return this.request2API(API_PATHS.resourceAdd, this.createOptions(), data);
    }

    resourceCatalog() {
        let data = {resource: this.resource, catalog: {}};
        return this.request2API(API_PATHS.resourceCatalog, this.createOptions(), data);
    }

    resourceCatalogAdd(name, url, region, other = {}) {
        let catalog = {name: name, url: url, region: region};
        for (let field in catalogModel) {
            if (other[field]) {
                catalogModel[field] = other[field];
            } else {
                delete catalogModel[field];
            }
        }
        catalog = Object.assign(catalogModel, catalog);
        let data = {"resource": this.resource, "catalog": catalogObj};
        return this.request2API(API_PATHS.resourceCatalogAdd, this.createOptions(), data);
    }

    resourceCatalogItem() {
        let data = {resource: this.resource, item: {}};
        return this.request2API(API_PATHS.resourceCatalogItem, this.createOptions(), data);
    }

    resourceCatalogItemAdd(name, url, region, other = {}) {
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
        return this.request2API(API_PATHS.resourceCatalogItemAdd, this.createOptions(), data);
    }

    getItemStruct(item_id) {
        let data = {resource: this.resource, item_id: item_id};
        return this.request2API(API_PATHS.getItemStruct, this.createOptions(), data);
    }

    createSign(strData) {
        const hash = require("crypto")
            .createHash("sha256")
            .update(strData + this.prev_key)
            .digest("hex")
            .toLowerCase();
        return hash;
    }

    async request2API(path, opt, data) {
        data.time = Math.floor(new Date().getTime() / 1000)
        let strData = JSON.stringify(data);
        opt.data = strData;
        opt.sign = this.createSign(strData);
        try {
            let response = await this.inst.post(path, opt);
            return response.data;
        } catch(err) {
                return err.response.data;
        }
    }
}
module.exports = { 
    MuAPICli: MuAPICli
 };