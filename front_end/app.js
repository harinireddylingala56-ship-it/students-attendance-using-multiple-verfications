async function login() {

    const loginType = document.getElementById("loginType").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    // Clear old message
    message.innerText = "";

    // Validate input
    if (!email || !password) {
        message.innerText = "Please enter email and password";
        message.style.color = "red";
        return;
    }

    // Select API according to login type
    let url;

    if (loginType === "student") {
        url = "http://localhost:5000/api/auth/student-login";
    } else if (loginType === "faculty") {
        url = "http://localhost:5000/api/auth/staff-login";
    } else {
        message.innerText = "Invalid login type";
        message.style.color = "red";
        return;
    }

    console.log("Login URL:", url);

    try {

        const response = await fetch(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Get response as text first
        const responseText = await response.text();

        console.log("Server response:", responseText);
        console.log("Status:", response.status);

        let data;

        try {
            data = JSON.parse(responseText);
        } catch (error) {
            data = {
                message: responseText || "Invalid server response"
            };
        }

        // Login failed
        if (!response.ok) {

            message.innerText =
                data.message || `Login failed (${response.status})`;

            message.style.color = "red";

            return;
        }

        // Check JWT token
        if (!data.token) {

            message.innerText =
                "Login successful, but JWT token was not received.";

            message.style.color = "red";

            console.log("Full server response:", data);

            return;
        }

        // Store JWT token
        localStorage.setItem("token", data.token);

        // Store login type
        localStorage.setItem("loginType", loginType);

        // Store user information if returned
        if (data.student) {
            localStorage.setItem(
                "user",
                JSON.stringify(data.student)
            );
        }

        if (data.staff) {
            localStorage.setItem(
                "user",
                JSON.stringify(data.staff)
            );
        }

        // Success message
        message.innerText = "Login successful!";
        message.style.color = "green";

        console.log("JWT token stored successfully");

        // Open dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        console.error("Login error:", error);

        message.innerText =
            "Cannot connect to server. Check browser console.";

        message.style.color = "red";
    }
}