const axios = require("axios");
const catalogModel = require("./models/catalog");
const itemModel = require("./models/catalog");
const { ALPN_ENABLED } = require("constants");

const API_PATHS = {
    auth:                   "/auth",
    resources:              "/resources",
    resource:               "/resource",
    resourceAdd:            "/resource/add",
    resourceCatalog:        "/resource/catalog",
    resourceCatalogAdd:     "/resource/catalog/add",
    resourceCatalogItem:    "/resource/catalog/item",
    resourceCatalogItemAdd: "/resource/catalog/item/add",
    getItemStruct:          "/resource/get_item_struct",
    resourceSearchItem:     "/resource/search/item",
    resourceSearchCatalog:     "/resource/search/catalog",


    
};
class MuAPICli {
    /**
     * @param  {string} pub_key - публичный ключ для API
     * @param  {string} prev_key - приватный ключ для API
     * @param  {string} resource - имя ресурса с которым будет работать клиент, В случае если ресурса еще нет в БД будет создан
     * @param  {string} resource_url - адрес ресурса с которым будет работать клиент
     * @param  {string} host - адрес API
     * @param  {number} port=80 -порт API
     */
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
    /**
     *  вызывается в конструкторе и проверяет авторизацию и наличие ресурса
     */
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
    /**
     * добавляет обязатедьные поля в тело запроса
     * @param  {Object} additionals={} - передаем сюда тело запроса
     */
    createOptions(additionals = {}) {
        let baseOpt = {
            public_key: this.pub_key,
        };
        let opt = Object.assign(baseOpt, additionals);
        return opt;
    }
    /**
     * @property {Function} - проверка авторизации
     */
    auth() {
        let data = {};
        return this.request2API(API_PATHS.auth, this.createOptions(), data)
    }
    /**
     * получает список ресурсов
     * @property {Function} - список ресурсов
     * @param  {string} meta="" - мета данные 
     * @returns Promise<{success: bool, api_response: Object}> смотри {@link request2API}
     */
    resources(meta = "") {
        let data = {};
        return this.request2API(API_PATHS.resources, this.createOptions(), data, meta);
    }

    resourceGet(meta = "") {
        let data = {"resource": this.resource};
        return this.request2API(API_PATHS.resource, this.createOptions(), data, meta);
    }
    /**
     * Добавление нового ресурса
     * @param  {string} name  - имя ресурса
     * @param  {string} url - адрес ресурса
     * @param  {string} meta=""
     * @returns Promise<{success: bool, api_response: Object}> смотри {@link request2API}
     */
    resourceAdd(name, url, meta = "") {
        let data = {resource: {name: name, url: url}};
        return this.request2API(API_PATHS.resourceAdd, this.createOptions(), data, meta);
    }
    /**
     * Каталоги текущего ресурса 
     * @param  {} catalog={} - фильтер
     * @param  {} meta=""
     */
    resourceCatalog(catalog = {}, meta = "") {
        let data = {resource: this.resource, catalog: catalog};
        return this.request2API(API_PATHS.resourceCatalog, this.createOptions(), data, meta);
    }
    /**
     * Проверка существования каталогов переданных как родительские
     * @param  {Array} parents - список id каталогов
     */
    async checkCatalogParents(parents) {
        let data = await this.searchCatalogById(parents);
        if (data.success) {
            console.log(data.api_response.data.length);
            console.log(parents.length);
            console.log(data.api_response.data.length < parents.length);
            if (data.api_response.data.length < parents.length) {
                console.log("invalid");
                throw  new Error("Not found catalog parent");
            } else {
                console.log("valid");
                return true;
            }
        } else {
            throw new Error(data);
        }
    }

    async resourceCatalogAdd(name, url, region, other = {}, meta = "") {
        let catalog = {name: name, url: url, region: region};
        for (let field in catalogModel) {
            if (other[field]) {
                catalogModel[field] = other[field];
            } else {
                delete catalogModel[field];
            }
        }
        let parent_id = catalogModel.parent_id;
        if (parent_id) {
            if (!catalogModel.parents){
                catalogModel.parents = [];
            }
            if (!catalogModel.parents.includes(parent_id)) {
                catalogModel.parents.push(parent_id);
            }
        }
        if (catalogModel.parents.length>0) {
            await this.checkCatalogParents(catalogModel.parents);
        }
        catalog = Object.assign(catalogModel, catalog);
        let data = {"resource": this.resource, "catalog": catalog};
        return this.request2API(API_PATHS.resourceCatalogAdd, this.createOptions(), data, meta);
    }

    resourceCatalogItem(meta = "") {
        let data = {resource: this.resource, item: {}};
        return this.request2API(API_PATHS.resourceCatalogItem, this.createOptions(), data, meta);
    }

    async resourceCatalogItemAdd(name, url, region, catalog_id, other = {}, meta = "") {
        let item = {name: name, url: url, region: region, catalog_id: catalog_id};
        for (let field in itemModel) {
            if (other[field]) {
                itemModel[field] = other[field];
            } else {
                delete itemModel[field];
            }
        }

        if (catalog_id) {
            if (!itemModel.catalogs){
                itemModel.catalogs = [];
            }
            if (!itemModel.catalogs.includes(catalog_id)) {
                itemModel.catalogs.push(catalog_id);
            }
            await this.checkCatalogParents(itemModel.catalogs);
        } else {
            throw new Error("Item must contain a catalog_id ");
        }

        item = Object.assign(catalogModel, item);

        let data = {resource: this.resource, item: item};
        return this.request2API(API_PATHS.resourceCatalogItemAdd, this.createOptions(), data, meta);
    }

    getItemStruct(item_id, meta = "") {
        let data = {resource: this.resource, item_id: item_id};
        return this.request2API(API_PATHS.getItemStruct, this.createOptions(), data, meta);
    }

    searchCatalog(type, request = {}, additional = {}, meta = "") {
        let data = {resource: this.resource, type: type, request: request};
        data = Object.assign(data, additional);
        return this.request2API(API_PATHS.resourceSearchCatalog, this.createOptions(), data, meta);

    }

    searchCatalogById(ids, id_field = "_id", meta = "") {
        let data = {id_field: id_field, id_values: ids};
        return this.searchCatalog("by_ids", {}, data, meta);
    }

    createSign(strData) {
        const hash = require("crypto")
            .createHash("sha256")
            .update(strData + this.prev_key)
            .digest("hex")
            .toLowerCase();
        return hash;
    }
    /**
     * @param  {} path
     * @param  {} opt
     * @param  {} data
     * @param  {} meta=""
     */
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
                if (err.errno == -61) {
                    throw new Error("Not connected to server")
                } else {
                    return {success: false, api_response: err.response.data};
                }
        }
    }
}
module.exports = { 
    MuAPICli: MuAPICli
 };