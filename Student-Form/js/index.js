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
    const ageErrorMasg1 = 'Age is required';
    const ageErrorMasg2 = 'Age must be between 18 and 25';
    const fileErrorMsg = 'Please upload your student ID';
    const fileTypeErrorMsg = 'Only PNG, JPG, or PDF files are allowed';
    const flavorErrorMsg = 'Please select a flavor';

    function nameValidation() {
        if (nameInput.value.trim() === '') {
            nameError.textContent = nameErrorMsg;
            return false;
        } else if (!/^[A-Za-z\s]+$/.test(nameInput.value)) {
            nameError.textContent = 'Only letters and spaces are allowed';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    }

    function ageValidation() {
        const ageValue = ageInput.value == '' ? '' : parseInt(ageInput.value, 10);
        if (ageValue === '') {
            ageError.textContent = ageErrorMasg1;
            return false;
        } else if (ageValue < 18 || ageValue > 25) {
            ageError.textContent = ageErrorMasg2;
            return false;
        } else {
            ageError.textContent = '';
            return true;
        }
    }

    function fileValidation() {
        const file = idFileInput.files[0];
        
        if (!file) {
            fileError.textContent = fileErrorMsg;
            return false;
        } else if (!allowedExtensions.includes(file.type)) {
            fileError.textContent = fileTypeErrorMsg;
            return false;
        } else {
            fileError.textContent = '';
            return true;
        }
    }

    function flavorValidation() {
        if (flavorSelect.value === '') {
            flavorError.textContent = flavorErrorMsg;
            return false;
        } else {
            flavorError.textContent = '';
            return true;
        }
    }

    nameInput.addEventListener('input', function() {
        nameValidation();
    });

    ageInput.addEventListener('input', function() {
        ageValidation();
    });

    idFileInput.addEventListener('change', function() {
        fileValidation();
    });

    flavorSelect.addEventListener('change', function() {
        flavorValidation();
    });

    document.getElementById('studentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const isNameValid = nameValidation();
        const isAgeValid = ageValidation();
        const isFileValid = fileValidation();
        const isFlavorValid = flavorValidation();

        if (isNameValid && isAgeValid && isFileValid && isFlavorValid) {
            const formData = new FormData();
            formData.append('name', nameInput.value);
            formData.append('age', ageInput.value);
            formData.append('flavor', flavorSelect.value);

            const file = idFileInput.files[0];
            const blob = new Blob([file], { type: file.type });
            formData.append('idFile', blob, file.name); 

            
            for (const [key, value] of formData.entries()) {
                if (value instanceof Blob) {
                    console.log(`${key}:`, value); 
                } else {
                    console.log(`${key}: ${value}`); 
                }
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

                
                document.getElementById('studentForm').reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

});
