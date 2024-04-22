document.addEventListener("DOMContentLoaded", function() {
    // Add event listener for form submission
    document.getElementById("age-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        
        // Get the user's date of birth from the input field
        let dobInput = document.getElementById("dob").value;
        let dob = new Date(dobInput);
        
        // Calculate the user's age
        let age = calculateAge(dob);
        
        // Check if the user is over 18 years old
        if (age >= 18) {
            // Redirect to the page for users over 18
            window.location.href="./HTML/Betting-BJ.html";
        } else {
            // Redirect to the page for users under 18
            window.location.href="./HTML/Non-betting BJ.html";
        }
    });
});

// Function to calculate age based on date of birth
function calculateAge(dateOfBirth) {
    let today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    let monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
    }
    
    return age;
}
