// Latest Release cards
getProducts("latest").then((data) =>
    productCardContainer(data, "#latest-rel", 'latest release')
);

// Shop page cards
getProducts("shop").then((data) =>
    productCardContainer(data, "#shop", 'our products')
);

// Back to top button
window.onscroll = function () {
    scrollFunction();
};

const scrollFunction = () => {
    let scrollTopBtn = document.getElementById('scrollTopBtn');
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollTopBtn.style.display = "block";
    } else {
        scrollTopBtn.style.display = "none";
    }
}

const scrollToTop = () => {
    document.body.scrollTop = 0 // For safari
    document.documentElement.scrollTop = 0 // For chrome, firefox, IE and opera
}