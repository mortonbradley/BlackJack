document.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById("age-form").addEventListener("submit", function(event) {
        event.preventDefault();
        
        
        let dobInput = document.getElementById("dob").value;
        let dob = new Date(dobInput);
        
       
        let age = calculateAge(dob);
        
        
        if (age >= 18) {
            
            window.location.href="./Betting-BJ.html";
        } else {
            
            window.location.href="./Non-betting BJ.html";
        }
    });
});


function calculateAge(dateOfBirth) {
    let today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    let monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
    }
    
    return age;
}
