'use strict';

import Notiflix from 'notiflix';

const axios = require('axios').default;
const ENDPOINT = `https://pixabay.com/api/`;

export default class ImgApiService {
    constructor() {
        this.page = 1;
        this.key = "33641734-f7d46c14b35bfa5eb977d9e1a";
        this.searchQuery = "";
        this.image_type = "photo";
        this.orientation = "horizontal";
        this.safesearch = true;
        this.onpage = 40;
    }

    async getImagesList() {
        const url = `${ENDPOINT}?key=${this.key}&image_type=${this.image_type}&q=${this.searchQuery}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.onpage}`;

        if(this.searchQuery === "") {
            Notiflix.Notify.info("Waiting for your query");
            throw new Error('No query');
        }
        const response = await axios.get(url);
        this.nextPage();
        return response.data;
    }

    nextPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
}