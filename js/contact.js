let element = document.getElementById('sub');

element.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgb(158, 239, 229)';
    this.style.color = 'rgb(60, 71, 75)';
    this.style.fontWeight = 'bold'; // Corrected here
    this.style.border = '1px solid rgb(60, 71, 75)';
});
  
element.addEventListener('mouseout', function() {
    this.style.backgroundColor = '';
    this.style.color = '';
    this.style.fontWeight = '';
    this.style.border = '';
});