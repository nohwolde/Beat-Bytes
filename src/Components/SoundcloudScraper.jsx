import * as cheerio from "cheerio";
import axios from "axios";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SoundCloudScraper {
    constructor() {
        this.isSoundCloudUrl = (url) => {
            if (!url) {
                return false;
            }
            return url.startsWith("https://soundcloud.com/");
        };
        this.getHtmlFromUrl = (url) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios.get(url);
            return response.data;
        });
        this.extractDataFromHtml = (htmlString) => {
            const HYDRATION_STRING = "window.__sc_hydration = ";
            let $ = cheerio.load(htmlString);
            let scriptString;
            for (let script of $("script:not([src])").toArray()) {
                scriptString = script.children[0].data;
                if (scriptString.startsWith(HYDRATION_STRING)) {
                    return JSON.parse(scriptString.replace(HYDRATION_STRING, "").slice(0, -1));
                }
            }
        };
        this.extractSound = (htmlString) => {
            const listOfHyrdrationData = this.extractDataFromHtml(htmlString);
            for (let obj of listOfHyrdrationData) {
                if (obj.hydratable === "sound") {
                    return obj.data;
                }
            }
            console.log("No sound data found");
            return {};
        };
        this.extractHydrationData = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                const htmlString = yield this.getHtmlFromUrl(url);
                const data = this.extractDataFromHtml(htmlString);
                return data;
            }
            catch (error) {
                console.error(error);
                console.log("No hydration data");
                return [];
            }
        });
        this.getSound = (url) => __awaiter(this, void 0, void 0, function* () {
            const htmlString = yield this.getHtmlFromUrl(url);
            return this.extractSound(htmlString);
        });
        this.getUser = (url) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isSoundCloudUrl(url)) {
                console.log("Not a SoundCloud url given");
                return {};
            }
            const listOfHyrdrationData = yield this.extractHydrationData(url);
            for (let obj of listOfHyrdrationData) {
                if (obj.hydratable === "user") {
                    return obj.data;
                }
            }
            console.log("No user data found");
            return {};
        });
    }
}
export { SoundCloudScraper };
