'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// Check if select element exists before adding event listener
if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
// Check if selectItems exist before looping
if (selectItems && selectItems.length > 0 && selectValue && select) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  // Check if filterItems exist
  if (!filterItems || filterItems.length === 0) return;

  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
// Check if filterBtn exists
if (filterBtn && filterBtn.length > 0) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText; // Check if selectValue exists
      filterFunc(selectedValue);

      if (lastClickedBtn) lastClickedBtn.classList.remove("active"); // Check if lastClickedBtn exists
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}


// contact form variables
const contactForm = document.getElementById("contactForm"); // Use the new ID
const formInputs = contactForm ? contactForm.querySelectorAll("[data-form-input]") : [];
const formBtn = contactForm ? contactForm.querySelector("[data-form-btn]") : null;
const formStatus = document.getElementById("form-status");

// Function to enable/disable submit button based on form validity
function validateForm() {
  if (contactForm && formBtn) {
    if (contactForm.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  }
}

// Add event to all form input fields for real-time validation
if (formInputs.length > 0) {
  formInputs.forEach(input => {
    input.addEventListener("input", validateForm);
  });
}

// Call validateForm initially to set the button state based on pre-filled values (if any)
// or to ensure it's correctly disabled if fields are empty and required.
if (contactForm) {
  validateForm(); 
}

// Handle form submission with AJAX
if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default page reload

    if (!contactForm.checkValidity()) {
      if(formStatus) formStatus.textContent = "Please fill out all required fields correctly.";
      if(formStatus) formStatus.style.color = "var(--bittersweet-shimmer)"; // Or your error color
      return;
    }

    const formData = new FormData(contactForm);
    const submitButtonOriginalText = formBtn ? formBtn.textContent : 'Send Message';
    
    if (formBtn) {
        formBtn.setAttribute("disabled", "");
        formBtn.textContent = "Sending...";
    }
    if (formStatus) {
        formStatus.textContent = ""; // Clear previous status
        formStatus.style.color = "var(--light-gray)"; // Default text color
    }


    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json' // Formspree can respond with JSON
        }
      });

      if (response.ok) {
        // Successful submission
        if(formStatus) formStatus.textContent = "Thanks! Your message has been sent successfully.";
        if(formStatus) formStatus.style.color = "var(--orange-yellow-crayola)"; // Success color
        contactForm.reset(); // Clear the form fields
        if (formBtn) formBtn.setAttribute("disabled", ""); // Keep disabled after reset until user types again
      } else {
        // Error from Formspree (e.g., validation error on their side)
        const data = await response.json();
        if (data.errors && data.errors.length > 0) {
            if(formStatus) formStatus.textContent = data.errors.map(error => error.message).join(", ");
        } else {
            if(formStatus) formStatus.textContent = "Oops! There was a problem submitting your form. Please try again.";
        }
        if(formStatus) formStatus.style.color = "var(--bittersweet-shimmer)"; // Error color
      }
    } catch (error) {
      // Network error or other issue
      console.error("Form submission error:", error);
      if(formStatus) formStatus.textContent = "An error occurred. Please check your connection and try again.";
      if(formStatus) formStatus.style.color = "var(--bittersweet-shimmer)"; // Error color
    } finally {
        if (formBtn) {
            // Re-enable the button or set it back to original text after a delay,
            // or let validation re-enable it. For now, we'll keep it disabled if reset.
            // To re-enable after a delay:
            // setTimeout(() => {
            //    formBtn.removeAttribute("disabled");
            //    formBtn.textContent = submitButtonOriginalText;
            //    validateForm(); // Re-validate to set initial state if form is empty
            // }, 3000);
            // For this implementation, we reset the form, so button should stay disabled.
            formBtn.textContent = submitButtonOriginalText;
            validateForm(); // This will keep it disabled because fields are now empty
        }
    }
  });
}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
// Check if navigationLinks and pages exist
if (navigationLinks && navigationLinks.length > 0 && pages && pages.length > 0) {
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {
      for (let j = 0; j < pages.length; j++) { // Use a different loop variable 'j'
        if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
          pages[j].classList.add("active");
          // Make sure 'i' here correctly refers to the clicked navigationLink
          // It might be better to find the active link again or manage active state more robustly
          // For now, assuming 'navigationLinks[i]' inside this loop is the intended clicked link
          navigationLinks.forEach(link => link.classList.remove("active")); // Remove active from all
          this.classList.add("active"); // Add active to the clicked one
          window.scrollTo(0, 0);
        } else {
          pages[j].classList.remove("active");
          // navigationLinks[j].classList.remove("active"); // This line was likely an error, should only remove active from non-matching pages
        }
      }
    });
  }
}


// Function to fetch and display Medium posts
async function fetchMediumPosts() {
  const mediumFeedUrl = 'https://medium.com/feed/@luuisotorres';
  const rss2jsonApiKey = null; // No API key needed for basic use, but good to be aware of if you hit limits
  // For higher volume, you might need an API key from rss2json.com
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumFeedUrl)}${rss2jsonApiKey ? `&api_key=${rss2jsonApiKey}` : ''}`;

  const postsContainer = document.getElementById('medium-posts');
  if (!postsContainer) {
    console.error('Medium posts container not found.');
    return;
  }

  // Clear existing content (e.g., loading message)
  postsContainer.innerHTML = '<li class="loading-message">Loading posts...</li>';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.status === 'ok' && data.items && data.items.length > 0) {
      postsContainer.innerHTML = ''; // Clear loading message

      data.items.forEach(item => {
        const postElement = document.createElement('li');
        postElement.classList.add('blog-post-item'); // For styling

        // Sanitize and truncate description
        let snippet = 'No description available.';
        if (item.description) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = item.description; // Let browser parse HTML
          // Find the first paragraph for a cleaner snippet, or use textContent
          const firstParagraph = tempDiv.querySelector('p');
          if (firstParagraph && firstParagraph.textContent.trim().length > 20) {
             snippet = firstParagraph.textContent.trim();
          } else {
             snippet = tempDiv.textContent.trim(); // Fallback to all text content
          }
          // Truncate
          snippet = snippet.substring(0, 200) + (snippet.length > 200 ? '...' : '');
        }


        // Format date (optional, but nice)
        const pubDate = new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        postElement.innerHTML = `
          ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" class="blog-post-thumbnail">` : ''}
          <div class="blog-post-content">
            <h3 class="h4 blog-post-title">
              <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
            </h3>
            <p class="blog-post-date">${pubDate}</p>
            <p class="blog-post-snippet">${snippet}</p>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="blog-post-readmore">Read more →</a>
          </div>
        `;
        postsContainer.appendChild(postElement);
      });
    } else if (data.items && data.items.length === 0) {
      postsContainer.innerHTML = '<li>No posts found.</li>';
    } else {
      postsContainer.innerHTML = `<li>Could not fetch posts. Status: ${data.status}</li>`;
      console.error('Error fetching Medium posts:', data.message || 'Unknown error from rss2json');
    }
  } catch (error) {
    console.error('Error fetching or parsing Medium posts:', error);
    postsContainer.innerHTML = '<li>Error loading posts. Please try again later.</li>';
  }
}


let blogPostsFetched = false;

if (navigationLinks && navigationLinks.length > 0 && pages && pages.length > 0) {
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener("click", function () {
      let targetPage = null; // To store the page that will be active

      for (let j = 0; j < pages.length; j++) {
        if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
          pages[j].classList.add("active");
          targetPage = pages[j].dataset.page; // Store the name of the activated page
          navigationLinks.forEach(link => link.classList.remove("active"));
          this.classList.add("active");
          window.scrollTo(0, 0);
        } else {
          pages[j].classList.remove("active");
        }
      }

      // If the blog page was just activated and posts haven't been fetched yet
      if (targetPage === "blog" && !blogPostsFetched) {
        fetchMediumPosts();
        blogPostsFetched = true; // Set flag to true so it doesn't fetch again
      }
    });
  }

  const initialActivePage = document.querySelector('.navbar-link.active');
  const initialActiveContent = document.querySelector('article.active[data-page]');

  if(initialActivePage && initialActivePage.innerText.toLowerCase() === 'blog' &&
     initialActiveContent && initialActiveContent.dataset.page === 'blog' &&
     !blogPostsFetched) {
        fetchMediumPosts();
        blogPostsFetched = true;
  } else if (!initialActivePage && navigationLinks[0] && navigationLinks[0].innerText.toLowerCase() === 'about') {
      // Defaulting to About, so blog posts won't load initially unless 'Blog' is clicked.
  }


} else {
  // Fallback if navigationLinks isn't set up as expected,
  // try to load if blog page is visible (less ideal)
  const blogPage = document.querySelector('article.blog[data-page="blog"]');
  if (blogPage && blogPage.classList.contains('active') && !blogPostsFetched) {
    fetchMediumPosts();
    blogPostsFetched = true;
  }
}