const api = require("./index");

const cli = new api.MuAPICli("xxxx", "qqqq", "wb", "https://www.wildberries.ru/", "http://localhost", 4000);
auth                   = cli.auth();
resources              = cli.resources();
resource               = cli.resourceGet();
resourceAdd            = cli.resourceAdd("wb", "https://www.wildberries.ru/");
resourceCatalog        = cli.catalogs();
checkCatalog           = cli.checkCatalogParents(["604e0c39c11b3a7dc7a35d01"]);
resourceCatalogAdd     = cli.catalogAdd("some_name32", "some_url", "Mos", {parent_id: "605af44fc11b3a64ede0c961"});
resourceCatalogItem    = cli.items();


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
apiConn(resourceCatalogAdd);
// apiConn(resourceCatalogItem);
// apiConn(resourceCatalogItemAdd);
// apiConn(getItemStruct);
// apiConn(searchCatalogBYId);

