// Declare an empty array to store leads (URLs).
let myLeads = [];

// Get references to various DOM elements.
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
const tabBtn = document.getElementById("tab-btn");

// Check if leads exist in local storage.
// If leads exist, assign them to the myLeads array and render them.
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}


// Add a click event listener to the tabBtn button.
// When clicked, query the active tab using the chrome.tabs API and retrieve the URL.
// Add the URL to the myLeads array, update local storage, and render the leads.
tabBtn.addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    });
});


// Add a click event listener to the ulEl unordered list element.
// Use event delegation to handle clicks on delete buttons.
ulEl.addEventListener("click", function(event) {
        // Check if the clicked element has the "delete-tab" class.
    if (event.target.classList.contains("delete-tab")) {
                // Find the closest parent <li> element.
        const listItem = event.target.closest("li");
                // Retrieve the URL from the <a> element within the <li>.
        const url = listItem.querySelector("a").getAttribute("href");
                // Find the index of the URL within the myLeads array.
        const index = myLeads.indexOf(url);
                // If the URL is found, remove it from the array, update local storage, and remove the list item from the DOM.
        if (index !== -1) {
            myLeads.splice(index, 1);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            listItem.remove();
        }
    }
});

// Render the leads in the ulEl unordered list element.
function render(leads) {
    let listItems = "";
    let counter = 0;
    for (let i = 0; i < leads.length; i++) {
        counter++;
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
                <p data-counter="${counter}" class="delete-tab">Delete</p>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

// Delete a lead from the myLeads array and local storage.
function deleteTab(counter) {
    const listItem = document.getElementById(`delete-tab-${counter}`);
    if (listItem) {
        const parent = listItem.parentNode;
        if (parent) {
            const url = parent.querySelector("a")?.getAttribute("href");
            const index = myLeads.indexOf(url);
            if (index !== -1) {
                myLeads.splice(index, 1);
                localStorage.setItem("myLeads", JSON.stringify(myLeads));
            }
            parent.remove();
        }
    }
}

// Add a click event listener to the deleteBtn button.
// When clicked, clear local storage, reset the myLeads array, and render the leads.
deleteBtn.addEventListener("click", function() {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});


// Add a click event listener to the inputBtn button.
// When clicked, retrieve the value from the inputEl input field, add it to the myLeads array, clear the input field, update local storage, and render the leads.
inputBtn.addEventListener("click", function() {
    myLeads.push(inputEl.value);
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
});
