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
     * Конструктор класса клиента
     * @constructor
     * @param  {string} pub_key - публичный ключ API
     * @param  {string} prev_key - приватный ключ API
     * @param  {string} resource - имя ресурса с которым будет работать клиент, В случае если ресурса еще нет в БД будет создан
     * @param  {string} resource_url - адрес ресурса с которым будет работать клиент
     * @param  {string} host - адрес API ```"domain.name"``` | ```"127.0.0.1"```
     * @param  {number} port - по умолчанию: 80 - порт на котором АПИ ждет соединение
     * 
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
     * @async
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
     * добавляет обязательные поля в тело запроса
     * @param  {Object} additionals={} - передаем сюда тело запроса
     * @returns {Object} Возвращает объединенный объект с полями
     */
    createOptions(additionals = {}) {
        let baseOpt = {
            public_key: this.pub_key,
        };
        let opt = Object.assign(baseOpt, additionals);
        return opt;
    }
    /**
     * проверка авторизации
     * @async
     */
    auth(meta = "") {
        let data = {};
        return this.request2API(API_PATHS.auth, this.createOptions({meta: meta}), data)
    }
    /**
     * получает список ресурсов
     * @async
     * @param  {string} meta   мета данные по умолчанию ```""```
     * @returns {Promise} Promise объект:```{success: true|false, api_response: any}```
     */
    resources(meta = "") {
        let data = {};
        return this.request2API(API_PATHS.resources, this.createOptions({meta: meta}), data);
    }
    /**
     * получает конкретный ресурс
     * @async
     * @param  {string} meta   мета данные по умолчанию ```""```
     * @returns {Promise} Promise объект:```{success: true|false, api_response: any}```
     */
    resourceGet(meta = "") {
        let data = {"resource": this.resource};
        return this.request2API(API_PATHS.resource, this.createOptions({meta: meta}), data);
    }
    /**
     * Добавление нового ресурса
     * @param  {string} name  - имя ресурса
     * @param  {string} url - адрес ресурса
     * @param  {string} meta=""
     * @returns {Promise} Promise объект:```{success: true|false, api_response: any}```
     */
    resourceAdd(name, url, meta = "") {
        let data = {resource: {name: name, url: url}};
        return this.request2API(API_PATHS.resourceAdd, this.createOptions({meta: meta}), data);
    }
    /**
     * Каталоги текущего ресурса 
     * @param  {} catalog={} - фильтер
     * @param  {} meta=""
     * @returns {Promise} Promise объект:```{success: true|false, api_response: any}```
     */
    resourceCatalog(catalog = {}, meta = "") {
        let data = {resource: this.resource, catalog: catalog};
        return this.request2API(API_PATHS.resourceCatalog, this.createOptions({meta: meta}), data);
    }
    /**
     * Проверка существования каталогов переданных как родительские
     * @param  {Array} parents - список id каталогов
     * @returns {(Boolean | Error)} вернет true если родители существуют и вызовет ошибку если нет
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
    /**
     * 
     * @param {String} name 
     * @param {String} url 
     * @param {String} region 
     * @param {Object} other 
     * @param {String} meta 
     * @returns Promise<{success: boolean;api_response: any;}>
     */
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
        return this.request2API(API_PATHS.resourceCatalogAdd, this.createOptions({meta: meta}), data);
    }
    /**
     * 
     * @param {String} meta 
     * @returns 
     */
    resourceCatalogItem(meta = "") {
        let data = {resource: this.resource, item: {}};
        return this.request2API(API_PATHS.resourceCatalogItem, this.createOptions({meta: meta}), data);
    }
    /**
     * 
     * @param {String} name 
     * @param {String} url 
     * @param {String} region 
     * @param {String} catalog_id 
     * @param {Object} other 
     * @param {String} meta 
     * @returns Promise<{success: boolean;api_response: any;}>
     */
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
        return this.request2API(API_PATHS.resourceCatalogItemAdd, this.createOptions({meta: meta}), data);
    }
    /**
     * 
     * @param {String} item_id 
     * @param {String} meta 
     * @returns Promise<{success: boolean;api_response: any;}>
     */
    getItemStruct(item_id, meta = "") {
        let data = {resource: this.resource, item_id: item_id};
        return this.request2API(API_PATHS.getItemStruct, this.createOptions({meta: meta}), data);
    }
    /**
     * 
     * @param {String} type 
     * @param {Object} request 
     * @param {Object} additional 
     * @param {String} meta 
     * @returns Promise<{success: boolean;api_response: any;}>
     */
    searchCatalog(type, request = {}, additional = {}, meta = "") {
        let data = {resource: this.resource, type: type, request: request};
        data = Object.assign(data, additional);
        return this.request2API(API_PATHS.resourceSearchCatalog, this.createOptions({meta: meta}), data);

    }
    /**
     * 
     * @param {array} ids 
     * @param {string} id_field 
     * @param {string} meta 
     * @returns 
     */
    searchCatalogById(ids, id_field = "_id", meta = "") {
        let data = {id_field: id_field, id_values: ids};
        return this.searchCatalog("by_ids", {}, data);
    }
    /**
     * 
     * @param {string} strData 
     * @returns string
     */
    createSign(strData) {
        const hash = require("crypto")
            .createHash("sha256")
            .update(strData + this.prev_key)
            .digest("hex")
            .toLowerCase();
        return hash;
    }
    /**
     * @param  {String} path
     * @param  {any} opt
     * @param  {Object} data
     * @param  {String} meta=""
     */
    async request2API(path, opt, data) {
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