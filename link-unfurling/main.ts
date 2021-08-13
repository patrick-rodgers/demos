// import { unfurl } from "./unfurl.js";
// import { unfurlByEmbedService } from "./unfurl-embed-service.js";
import { unfurlBySearch } from "./unfurl-search.js";
import { urls } from "./urls.js";


// start fresh
console.clear();

await Promise.all(urls.map(url => unfurlBySearch(url).catch(e => {

    console.error(`Error for ${url}:`);
    console.error(e);
    console.log();

}).then(v => {

    console.error(`Result for ${url}:`);
    console.log(v);
    console.log();

})));

console.log("done");
