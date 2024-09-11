document.addEventListener('DOMContentLoaded', function () {
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const idFileInput = document.getElementById('idFile');
    const flavorSelect = document.getElementById('flavor');
    
    const nameError = document.getElementById('nameError');
    const ageError = document.getElementById('ageError');
    const fileError = document.getElementById('fileError');
    const flavorError = document.getElementById('flavorError');

    const allowedExtensions = ['image/png', 'image/jpeg', 'application/pdf'];

    const nameErrorMsg = 'Name is required';
    const ageErrorMasg = 'Age must be between 18 and 25';
    const fileErrorMsg = 'Please upload your student ID';
    const fileTypeErrorMsg = 'Only PNG, JPG, or PDF files are allowed';
    const flavorErrorMsg = 'Please select a flavor';

    nameInput.addEventListener('input', function() {
        if (nameInput.value.trim() === '') {
            nameError.textContent = nameErrorMsg;
        } else if (!/^[A-Za-z\s]+$/.test(nameInput.value)) {
            nameError.textContent = 'Only letters and spaces are allowed';
        } else {
            nameError.textContent = '';
        }
    });

    ageInput.addEventListener('input', function() {
        const ageValue = parseInt(ageInput.value, 10);
        if (ageValue < 18 || ageValue > 25) {
            ageError.textContent = ageErrorMasg;
        } else {
            ageError.textContent = '';
        }
    });

    idFileInput.addEventListener('change', function() {
        const file = idFileInput.files[0];
        
        if (!file) {
            fileError.textContent = fileErrorMsg;
        } else if (!allowedExtensions.includes(file.type)) {
            fileError.textContent = fileTypeErrorMsg;
        } else {
            fileError.textContent = '';
        }
    });

    flavorSelect.addEventListener('change', function() {
        if (flavorSelect.value === '') {
            flavorError.textContent = flavorErrorMsg;
        } else {
            flavorError.textContent = '';
        }
    });

    document.getElementById('studentForm').addEventListener('submit', function(event) {
        if (nameInput.value.trim() === '') {
            nameError.textContent = nameErrorMsg;
            event.preventDefault();
        }
        if (ageInput.value === '' || parseInt(ageInput.value, 10) < 16 || parseInt(ageInput.value, 10) > 23) {
            ageError.textContent = ageErrorMasg;
            event.preventDefault();
        }
        const file = idFileInput.files[0];
        if (!file) {
            fileError.textContent = fileErrorMsg;
            event.preventDefault();
        } else if (!allowedExtensions.includes(file.type)) {
            fileError.textContent = fileTypeErrorMsg;
            event.preventDefault();
        }
        if (flavorSelect.value === '') {
            flavorError.textContent = flavorErrorMsg;
            event.preventDefault();
        }
    });

    document.getElementById('studentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(this);
       
        for (const formEntry of formData.entries()) {
            console.log(`${formEntry[0]}: ${formEntry[1]}`);
        }
        
        fetch('/bin/studentverification', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else if (data.couponCode) {
                alert("Congratulations! Your coupon code is: " + data.couponCode);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
