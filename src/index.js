import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import ImgApiService from './js/axiosgetimage.js';
import NextPageBtn from './js/nextpagebtn.js';


let inputText = '';

const form = document.getElementById("search-form");
const galleryWrapper = document.querySelector('.gallery');
const moreLoadImages = document.getElementById("moreBtn");
const imageApiService  = new ImgApiService;
const loadMoreBtn  = new NextPageBtn ({
    selector: ".more-btn",
    isHidden: true,
});
const gallery = new SimpleLightbox('.gallery a', {
    captions: false,
    captionDelay: 250,
});

form.addEventListener("input", onInputData);
form.addEventListener("submit", onSubmit);
moreLoadImages.addEventListener("click", fetchImages);

function onInputData(e) {
    return inputText = e.target.value.trim();
}

function onSubmit(e) {
    e.preventDefault();
    imageApiService.searchQuery = inputText;
    imageApiService.resetPage();
    clearPage();
    loadMoreBtn.show();
    fetchImages().finally(() => form.reset())
};

function clearPage() {
    galleryWrapper.innerHTML = "";
}

function appendImageCards(markup) {
    galleryWrapper.insertAdjacentHTML("beforeend", markup);
}

async function fetchImages() {
    loadMoreBtn.hide();

    try {  
        const data = await imageApiService.getImagesList();
        const totalHits = data.total;
        if (totalHits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            loadMoreBtn.hide();
            throw new Error('No data')
        }
        
        const images = data.hits;

        const  markup =  images.reduce(
            (markup, image) => 
            createImage(image) + markup,
            ""
        );    
        appendImageCards(markup);

        gallery.refresh();
        loadMoreBtn.show();
        loadMoreBtn.enable();

        if(galleryWrapper.childElementCount === totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.hide()
        } else if(galleryWrapper.childElementCount <= 40) {
            Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
        } 

        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    } catch (error) {
        console.error(error);
    }
}

function createImage({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads}) {
    return`
    <div class="gallery-card">
        <a class="gallery-item" href="${largeImageURL}">
            <img
                class="gallery-image"
                src="${webformatURL}"
                alt="${tags}"
                loading="lazy"
            />
        </a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
                <b>Views</b> ${views}
            </p>
            <p class="info-item">
                <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b> ${downloads}
            </p>
        </div>
    </div>
    `
}