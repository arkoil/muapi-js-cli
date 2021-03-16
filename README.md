# muapi-js-cli

### Table of Contents

-   [constructor][1]
    -   [Parameters][2]
    -   [Examples][3]
-   [init][4]
-   [createOptions][5]
    -   [Parameters][6]
-   [auth][7]
    -   [Parameters][8]
-   [resources][9]
    -   [Parameters][10]
-   [resourceGet][11]
    -   [Parameters][12]
-   [resourceAdd][13]
    -   [Parameters][14]
-   [catalogs][15]
    -   [Parameters][16]
-   [checkCatalogParents][17]
    -   [Parameters][18]
-   [catalogAdd][19]
    -   [Parameters][20]
    -   [Examples][21]
-   [items][22]
    -   [Parameters][23]
-   [itemAdd][24]
    -   [Parameters][25]
    -   [Examples][26]
-   [getItemStruct][27]
    -   [Parameters][28]
-   [searchCatalogs][29]
    -   [Parameters][30]
    -   [Examples][31]
-   [searchCatalogsById][32]
    -   [Parameters][33]
    -   [Examples][34]
-   [createSign][35]
    -   [Parameters][36]
-   [request2API][37]
    -   [Parameters][38]

## constructor

Конструктор класса клиента

### Parameters

-   `pub_key` **[string][39]** публичный ключ API
-   `prev_key` **[string][39]** приватный ключ API
-   `resource` **[string][39]** имя ресурса, если ресурса нет в БД, он будет создан
-   `resource_url` **[string][39]** адрес ресурса (нужен для создания, если вы уверены, что ресурс существует, укажите просто: `""`)
-   `host` **[string][39]** адрес API `"domain.name"` \| `"127.0.0.1"`
-   `port` **[number][40]** по умолчанию: 80 - порт на котором АПИ ждет соединение (optional, default `80`)

### Examples

```javascript
const api = require("muapi-js-cli")
const cli = new api.MuAPICli("pub_key", "priv_key", "resource", "https://www.resource.ru/", "http://api.com", 2233);
```

## init

вызывается в конструкторе и проверяет авторизацию и наличие ресурса

## createOptions

добавляет обязательные поля в тело запроса

### Parameters

-   `additionals` **[Object][41]** тело запроса (optional, default `{}`)

Returns **[Object][41]** Возвращает объединенный объект с полями

## auth

проверка авторизации

### Parameters

-   `meta`   (optional, default `""`)

## resources

получает список ресурсов

### Parameters

-   `meta` **[string][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

Returns **[Promise][42]&lt;{success: [Boolean][43], api_response: [Object][41]}>** Promise объект:`{success: true|false, api_response: any}`

## resourceGet

получает конкретный ресурс

### Parameters

-   `meta` **[string][39]** мета данные по умолчанию `""` (optional, default `""`)

Returns **[Promise][42]&lt;{success: [Boolean][43], api_response: [Object][41]}>** Promise объект:`{success: true|false, api_response: any}`

## resourceAdd

Добавление нового ресурса

### Parameters

-   `name` **[string][39]** имя ресурса
-   `url` **[string][39]** адрес ресурса
-   `meta` **[string][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

Returns **[Promise][42]&lt;{success: [Boolean][43], api_response: [Object][41]}>** Promise объект:`{success: true|false, api_response: any}`

## catalogs

Каталоги текущего ресурса

### Parameters

-   `catalog` **[string][39]** запрос в базу ...collection.find(`{...}`), см [документацию монго][44] (optional, default `{}`)
-   `meta` **[string][39]** по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

Returns **[Promise][42]&lt;{success: [Boolean][43], api_response: [Object][41]}>** Promise объект:`{success: true|false, api_response: any}`

## checkCatalogParents

Проверка существования каталогов переданных как родительские

### Parameters

-   `parents` **[Array][45]** список id каталогов

Returns **([Boolean][43] \| [Error][46])** вернет true если родители существуют и вызовет ошибку если нет

## catalogAdd

Добавляем каталог в ресурс

### Parameters

-   `name` **[String][39]** Имя каталога (как в источнике)
-   `url` **[String][39]** Урл каталога
-   `region` **[String][39]** Регион, если он имеется, если нет то просто `""`, Внимание! если регион имеется в источнике, но вы просто опустили эти данные, настоятельно рекомендуется данные получить и передать! Простое затыкание данных `""` вызовет серьезные проблемы в будующем! Убедитесь, что ресурс действительно не содержит данных по региону прежде чем передать пустое поле!
-   `other` **[Object][41]** Все остальные данные каталога:
     {   `description:` string,  
       `external_id:` string,  
       `parents:` array(BSON.Id.toString), - массив родительских категорий  
       `parent_id:` BSON.Id.toString,  
       `image:` string,  
       `additional:` Object,  
       `uniform_name:` string   } (optional, default `{}`)
-   `meta` **[String][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

### Examples

```javascript
resourceCatalogAdd("Пылысосы", "https://wildberries.com/pilesos", "Moscow", {description: "Пылесосы с бесплатной доставкой на Wildberries", external_id: "12345", parents: ["604f34e0b37c79215a61d9b2"], parent_id: "604f34e0b37c79215a61d9b2", image: "https://wilberries.com/imgs/123.png", additional:{filters:[{filter_id: 123}]}, uniform_name: "pilesos"}, "pilesos_add_12345")
```

Returns **[Promise][42]&lt;{success: [Boolean][43], api_response: [Object][41]}>** Promise объект:`{success: true|false, api_response: any}`

## items

Получение списка айтэмов у данного ресурса

### Parameters

-   `find_by` **[string][39]** критерий отбора (optional, default `{}`)
-   `meta` **[String][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

## itemAdd

### Parameters

-   `name` **[String][39]** 
-   `url` **[String][39]** 
-   `region` **[String][39]** 
-   `catalog_id` **[String][39]** 
-   `other` **[Object][41]**  (optional, default `{}`)
-   `meta` **[String][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

### Examples

```javascript
resourceItemAdd("Пылысос 1", "https://wildberries.com/pilesos/1", "Moscow", "604e0c39c11b3a7dc7a35d01", {description: "Самый сосущий пылесос на Wildberries", external_id: "12345", rating: 0.5, model: "pil1", price: 1000.0, reviews:10, currency: "RUB", article: 087956, catalogs: ["604f34e0b37c79215a61d9b2"], catalog_id: "604f34e0b37c79215a61d9b2", image: "https://wilberries.com/imgs/123.png", additional: {filters: [ { filter_id: 123, value: "мега пылесос" } ] }, uniform_name: "pil1"}, "pil_add_1")
```

Returns **any** Promise&lt;{success: boolean;api_response: any;}>

## getItemStruct

Получение полной структуры айтема включая каталог

### Parameters

-   `item_id` **[String][39]** BSONObjectId - текстовое представление
-   `meta` **[String][39]** по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

Returns **any** Promise&lt;{success: boolean;api_response: any;}>

## searchCatalogs

Поиск по каталогам

### Parameters

-   `type` **[String][39]** тип поиска на данный момент поддерживается только "by_ids"
-   `request` **[Object][41]** дополнительные критерии поиска, например: `{name: "Пылесос 1"}` (optional, default `{}`)
-   `additional` **[Object][41]** основное тело запроса (почему же additional?) (optional, default `{}`)
-   `meta` **[String][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

### Examples

```javascript
searchCatalog("by_ids",{region:"Moscow"},{id_field: "_id", values:["604f34e0b37c79215a61d9b2"]})
```

Returns **any** Promise&lt;{success: boolean;api_response: any;}>

## searchCatalogsById

Метод хелпер для вызова поиска с типом `"by_ids"`

### Parameters

-   `ids` **[array][45]** массив значений ид которые будем искать
-   `id_field` **[string][39]** определяющее поле по которому будем искать (optional, default `"_id"`)
-   `meta` **[string][39]** meta по умолчанию `""` , вернется как есть, служит для индентификации событий, при событийной модели на стороне клиента (optional, default `""`)

### Examples

```javascript
searchCatalogsById(["604f34e0b37c79215a61d9b2"],"_id", "searchCatalogEvent[084521]")
```

Returns **any** 

## createSign

Создание цифровой подписи для данных

### Parameters

-   `strData` **[string][39]** 

Returns **any** string

## request2API

Запрос в АПИ

### Parameters

-   `path` **[String][39]** "путь в рамках роутов АПИ"
-   `opt` **any** 
-   `data` **[Object][41]** 

[1]: #constructor

[2]: #parameters

[3]: #examples

[4]: #init

[5]: #createoptions

[6]: #parameters-1

[7]: #auth

[8]: #parameters-2

[9]: #resources

[10]: #parameters-3

[11]: #resourceget

[12]: #parameters-4

[13]: #resourceadd

[14]: #parameters-5

[15]: #catalogs

[16]: #parameters-6

[17]: #checkcatalogparents

[18]: #parameters-7

[19]: #catalogadd

[20]: #parameters-8

[21]: #examples-1

[22]: #items

[23]: #parameters-9

[24]: #itemadd

[25]: #parameters-10

[26]: #examples-2

[27]: #getitemstruct

[28]: #parameters-11

[29]: #searchcatalogs

[30]: #parameters-12

[31]: #examples-3

[32]: #searchcatalogsbyid

[33]: #parameters-13

[34]: #examples-4

[35]: #createsign

[36]: #parameters-14

[37]: #request2api

[38]: #parameters-15

[39]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[40]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[41]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[42]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[43]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[44]: https://docs.mongodb.com/manual/tutorial/query-documents/

[45]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[46]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error
