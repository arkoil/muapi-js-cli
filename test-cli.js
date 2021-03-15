const api = require("./index");

const cli = new api.MuAPICli("xxxx", "qqqq", "wb", "https://www.wildberries.ru/", "http://localhost", 4000);
// auth               = cli.auth();
// resources          = cli.resources();
// resource           = cli.resourceGet();
// resourceAdd        = cli.resourceAdd("wb", "https://www.wildberries.ru/");
// resourceCatalog    = cli.resourceCatalog();
// checkCatalog = cli.checkCatalogParents(["604e0c39c11b3a7dc7a35d01"]);
// resourceCatalogAdd = cli.resourceCatalogAdd("одежда", "https://www.wildberries.ru/catalog/muzhchinam/odezhda", "Moscow", {parent_id: "604e0c39c11b3a7dc7a35d01"});
// resourceCatalogItem = cli.resourceCatalogItem();
resourceCatalogItemAdd = cli.resourceCatalogItemAdd(" Футболка", "https://www.wildberries.ru/catalog/11566676/detail.aspx?targetUrl=GP", "Moscow", "604e0c39c11b3a7dc7a35d01",{});
// getItemStruct = cli.getItemStruct("604ec877c11b3a7dc79f2016");
// searchCatalogBYId = cli.searchCatalogById(["604e0c39c11b3a7dc7a35d01"]);


apiConn = async function(prom) {
    let res = await prom;
    console.log(res);
    return res;
}

// apiConn(auth);
// apiConn(resources);
// apiConn(resource);
// apiConn(resourceAdd);
// apiConn(resourceCatalog);
// apiConn(checkCatalog);
// apiConn(resourceCatalogAdd);
// apiConn(resourceCatalogItem);
apiConn(resourceCatalogItemAdd);
// apiConn(getItemStruct);
// apiConn(searchCatalogBYId);

