const createFooter = () => {
  let footer = document.querySelector("footer");

  footer.innerHTML = `
   <a href = "/">
      <h3 class="web-logo">Fuego<span>X</span>Relvetti</h3>
  </a>
     

      <ul class="footer__nav">
        <li><a href="/">Home</a></li>
        <li><a href="/shop">Shop</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contacts</a></li>
        <li><a href="/terms-and-conditions">Policies</a></li>
      </ul>

      <ul class="footer__social">

      
       
        <li>
             <a href = "https://www.instagram.com/fuegoxrelvetti_/" target = "_blank">
                <img src="../images/social-icons/instagram.svg" alt="instagram" />
            </a>
        </li> 
      </ul>

      <div class = "line"></div>
      <p class = "copyright">Copyright <i class="fi fi-rr-copyright"></i> 2024 - Fuego X Relvetti</p>

`;
};

createFooter();
