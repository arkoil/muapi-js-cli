const api = require("./index");

const cli = new api.MuAPICli("xxxx", "qqqq", "wb", "https://www.wildberries.ru/", "http://localhost", 4000);
auth               = cli.auth();
resources          = cli.resources();
resource           = cli.resourceGet();
resourceAdd        = cli.resourceAdd("wb", "https://www.wildberries.ru/");
resourceCatalog    = cli.resourceCatalog("wb");
resourceCatalogAdd = cli.resourceCatalogAdd("одежда", "https://www.wildberries.ru/catalog/muzhchinam/odezhda", "Moscow");
resourceCatalogItem = cli.resourceCatalogItem();
resourceCatalogItemAdd = cli.resourceCatalogItemAdd(" Футболка", "https://www.wildberries.ru/catalog/11566676/detail.aspx?targetUrl=GP", "Moscow", {parent_id: null, catalog_id: "604de597c11b3a65e50319f5"});
// getItemStruct = cli.getItemStruct("604ec877c11b3a7dc79f2016");

apiConn = async function(prom) {
    let res = await prom;
    console.log(res);
    return res;
}

apiConn(auth);
apiConn(resources);
apiConn(resource);
apiConn(resourceAdd);
apiConn(resourceCatalog);
apiConn(resourceCatalogAdd);
apiConn(resourceCatalogItem);
apiConn(resourceCatalogItemAdd);
// apiConn(getItemStruct);

