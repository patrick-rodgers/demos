import { unfurl } from "./unfurl.js";

const urls = [

    // page
    "https://{tenant}.sharepoint.com/sites/dev/SitePages/Test.aspx",

    // page - sharing link
    "https://{tenant}.sharepoint.com/:u:/s/dev/EdCYsC3OWohImF6-_ckVw7oBccGWq4Tgqf83zw_zqSnoaQ?e=C99dpZ",

    // document - sharing link
    "https://{tenant}.sharepoint.com/:t:/s/dev/EZpF_9zRzcRIpmWZ2SRE8VwBr7SGzqlaana6EK6pV9Wtiw?e=DFvexS",

    // document - direct link
    "https://{tenant}.sharepoint.com/sites/dev/Shared%20Documents/text-file.txt",

    // site
    "https://{tenant}.sharepoint.com/sites/dev/",

    // site - sharing link
    "https://{tenant}.sharepoint.com/sites/dev?e=1%3A3aaaa3c60bb04f9413e9b74c19cde0b1"
];

// start fresh
console.clear();

await Promise.all(urls.map(url => unfurl(url).catch(e => {

    console.error(`Error for ${url}:`);
    console.error(e);
    console.log();

}).then(v => {

    console.error(`Result for ${url}:`);
    console.log(v);
    console.log();

})));

console.log("done");
