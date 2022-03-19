const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio');
let app = express();
var fs = require('fs');
var http = require("http");
const { json } = require('express');

let urlsList = [
    // "https://printo.in/categories/corporate-gifting",
    // "https://printo.in/categories/photo-gifts",
    // "https://printo.in/categories/wall-decor",
    // "https://printo.in/categories/t-shirts",
    // "https://printo.in/categories/caps",
    // "https://printo.in/categories/stationery",
    // "https://printo.in/categories/marketing",
    // "https://printo.in/categories/packaging-materials",
    // "https://printo.in/categories/same-day-products",
    // "https://printo.in/categories/awards",
    // "https://printo.in/categories/design-services"
];
async function getUser() {
    try {
        if (!urlsList.length) {
            return
        }
        urlsList.forEach(async (urlbyinput) => {
            const response = await axios.get(urlbyinput);
            const length = fs.readdirSync('./images').length || 0;
            console.log(length);
            const html = response.data;
            const $ = cheerio.load(html);
            let imgurl = [];
            $('.next-image-container').each(async (i, elem) => {
                let url = elem.children[0].children[0].children[0].data.split('srcSet=')[1].split(',')[0].split(' ')[0];
                imgurl.push(url);
            })
            let uniqueUrlsList = [...new Set(imgurl)];
            uniqueUrlsList.forEach(async (url, i) => {
                (async () => {
                    console.log(url);
                    let findextension = url.split('.');
                    let extension = findextension[findextension.length - 1];
                    let count = i + length;
                    await download(url, `./images/example${count}.${extension}`);
                })();
            })
            fs.writeFileSync('./docs/downloadedurl.text', uniqueUrlsList, () => {
                console.log('Saved!');
            })

        })

    } catch (error) {
        console.error(error);
    }
}
// getUser();


// urlsList = ['https://www.behance.net/'];
urlsList = ['https://www.behance.net/gallery/130201737/Blue-Sindroms?tracking_source=search_projects_recommended'];
async function behance() {
    try {
        if (!urlsList.length) {
            return
        }
        urlsList.forEach(async (urlbyinput) => {
            const response = await axios.get(urlbyinput);
            const length = fs.readdirSync('./images').length || 0;
            
            const html = response.data;
            const $ = cheerio.load(html);
            
            let abc = $('div[class="ImageElement-root-33P ImageElement-loaded-1V2"] > img').attr('src');
            console.log(abc);
            // let imgurl = [
            // ];
       
  


            // fs.writeFileSync('./docs/webpagehtml.text',html,()=>{
            //     console.log('Saved!');
            // })

        })

    } catch (error) {
        console.error(error);
    }
}

behance();


app.listen(3000, () => {
    console.log('server is running on port 3000');
})


var download = function (urlPath, dest, cb) {
    try {
        let url = urlPath.split('"')[1].trim();
        url = url.replace("https://", 'http://');
        var file = fs.createWriteStream(dest);
        console.log("second", dest)
        http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(cb);
            });
        });
    } catch (error) {
        console.log(error);
    }

}