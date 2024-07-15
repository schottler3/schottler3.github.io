
function applyEnlarge(element) {
    element.classList.add('enlarged');
}

function removeEnlarge(element){
    element.classList.remove('enlarged');
}

function showToast(message) {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.top = '10%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'white';
    toast.style.color = 'rgb(79, 124, 172)';
    toast.style.padding = '5px';
    toast.style.fontWeight= 'bold';
    toast.style.borderRadius = '5px';
    document.body.appendChild(toast);
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

function onload() {
    let navItems = document.getElementsByClassName('nav-item');
    for(let i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('mouseover', function () {
            applyEnlarge(navItems[i]);
        });
        navItems[i].addEventListener('mouseout', function () {
            removeEnlarge(navItems[i]);
        });
    }

    let title = document.getElementById('title');
    title.addEventListener('click', function (event) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    showToast("URL copied!");
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                });
        }
        else{
            window.alert("Your browser does not support copying text to the clipboard :/");
        }
    });
}

window.addEventListener('load', onload);