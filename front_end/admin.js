
// ==========================================
// GLOBAL VARIABLES
// ==========================================

let allStudents = [];
let allFaculty = [];

const API = "http://localhost:5000/api";

const token = localStorage.getItem("token");


// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

if (!token || localStorage.getItem("loginType") !== "admin") {

    alert("Please login as Admin");

    window.location.href = "index.html";
}


// ==========================================
// COMMON API REQUEST FUNCTION
// ==========================================

async function apiRequest(endpoint, method = "GET", body = null) {

    const options = {

        method: method,

        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API}${endpoint}`, options);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
}


// ==========================================
// LOAD ADMIN DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const [studentData, facultyData, attendanceData] =
            await Promise.all([

                apiRequest("/students"),

                apiRequest("/staff"),

                apiRequest("/attendance")

            ]);


        // Store student records

        allStudents = Array.isArray(studentData)
            ? studentData
            : studentData.students || [];


        // Store faculty records

        allFaculty = Array.isArray(facultyData)
            ? facultyData
            : facultyData.staff || [];


        // Attendance records

        const attendance = Array.isArray(attendanceData)
            ? attendanceData
            : attendanceData.attendance || [];


        // Update dashboard statistics

        document.getElementById("studentCount").innerText =
            allStudents.length;

        document.getElementById("facultyCount").innerText =
            allFaculty.length;

        document.getElementById("attendanceCount").innerText =
            attendance.length;


        // Display all records

        displayStudents(allStudents);

        displayFaculty(allFaculty);


    } catch (error) {

        console.error("Dashboard Error:", error);

        document.getElementById("students").innerText =
            "Unable to load students: " + error.message;

        document.getElementById("faculty").innerText =
            "Unable to load faculty: " + error.message;

    }
}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(students) {

    const container = document.getElementById("students");

    if (students.length === 0) {

        container.innerHTML = "No students registered.";

        return;
    }


    let html = `

        <table border="1" cellpadding="10" width="100%">

            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Section</th>
                <th>Actions</th>
            </tr>

    `;


    students.forEach(s => {

        html += `

            <tr>

                <td>${s.studentId || ""}</td>

                <td>${s.name || ""}</td>

                <td>${s.email || ""}</td>

                <td>${s.branch || ""}</td>

                <td>${s.year || ""}</td>

                <td>${s.section || ""}</td>

                <td>

                    <button onclick="editStudent('${s._id}')">
                        Edit
                    </button>

                    <button onclick="deleteStudent('${s._id}')">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });


    html += "</table>";

    container.innerHTML = html;

}


// ==========================================
// DISPLAY FACULTY
// ==========================================

function displayFaculty(faculty) {

    const container = document.getElementById("faculty");

    if (faculty.length === 0) {

        container.innerHTML = "No faculty registered.";

        return;
    }


    let html = `

        <table border="1" cellpadding="10" width="100%">

            <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>

    `;


    faculty.forEach(f => {

        html += `

            <tr>

                <td>${f.staffId || ""}</td>

                <td>${f.name || ""}</td>

                <td>${f.email || ""}</td>

                <td>${f.department || ""}</td>

                <td>${f.role || ""}</td>

                <td>

                    <button onclick="editFaculty('${f._id}')">
                        Edit
                    </button>

                    <button onclick="deleteFaculty('${f._id}')">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });


    html += "</table>";

    container.innerHTML = html;

}


// ==========================================
// SHOW / HIDE STUDENT FORM
// ==========================================

function showAddStudentForm() {

    document.getElementById("studentForm").style.display = "block";

}


function hideStudentForm() {

    document.getElementById("studentForm").style.display = "none";

}


// ==========================================
// ADD STUDENT
// ==========================================

async function addStudent() {

    const student = {

        studentId: document.getElementById("studentId").value.trim(),

        rollNumber: document.getElementById("rollNumber").value.trim(),

        name: document.getElementById("studentName").value.trim(),

        email: document.getElementById("studentEmail").value.trim(),

        password: document.getElementById("studentPassword").value,

        branch: document.getElementById("studentBranch").value.trim(),

        year: Number(document.getElementById("studentYear").value),

        section: document.getElementById("studentSection").value.trim()

    };


    if (
        !student.studentId ||
        !student.rollNumber ||
        !student.name ||
        !student.email ||
        !student.password ||
        !student.branch ||
        !student.year ||
        !student.section
    ) {

        alert("Please fill all required student fields.");

        return;
    }


    try {

        const data = await apiRequest(
            "/students",
            "POST",
            student
        );


        alert(data.message || "Student added successfully!");

        hideStudentForm();


        document.querySelectorAll("#studentForm input")
            .forEach(input => input.value = "");


        await loadDashboard();


    } catch (error) {

        alert(error.message);

    }

}


// ==========================================
// EDIT STUDENT
// ==========================================

async function editStudent(id) {

    const s = allStudents.find(item => item._id === id);

    if (!s) return;


    const name = prompt("Enter Name:", s.name);

    if (name === null) return;


    const email = prompt("Enter Email:", s.email);

    if (email === null) return;


    const branch = prompt("Enter Branch:", s.branch);

    if (branch === null) return;


    const year = prompt("Enter Year:", s.year);

    if (year === null) return;


    const section = prompt("Enter Section:", s.section);

    if (section === null) return;


    if (
        !name.trim() ||
        !email.trim() ||
        !branch.trim() ||
        !year.trim() ||
        !section.trim() ||
        !Number.isFinite(Number(year))
    ) {

        alert("Please enter valid student details.");

        return;
    }


    try {

        const data = await apiRequest(

            `/students/${id}`,

            "PATCH",

            {
                name: name.trim(),
                email: email.trim(),
                branch: branch.trim(),
                year: Number(year),
                section: section.trim()
            }

        );


        alert(data.message || "Student updated successfully!");

        await loadDashboard();


    } catch (error) {

        alert(error.message);

    }

}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(id) {

    if (!confirm("Do you want to delete this student?")) return;


    try {

        const data = await apiRequest(

            `/students/${id}`,

            "DELETE"

        );


        alert(data.message || "Student deleted successfully!");

        await loadDashboard();


    } catch (error) {

        alert(error.message);

    }

}


// ==========================================
// SHOW / HIDE FACULTY FORM
// ==========================================

function showAddFacultyForm() {

    document.getElementById("facultyForm").style.display = "block";

}


function hideFacultyForm() {

    document.getElementById("facultyForm").style.display = "none";

}


// ==========================================
// ADD FACULTY
// ==========================================

async function addFaculty() {

    const faculty = {

        staffId: document.getElementById("staffId").value.trim(),

        name: document.getElementById("facultyName").value.trim(),

        email: document.getElementById("facultyEmail").value.trim(),

        password: document.getElementById("facultyPassword").value,

        department: document.getElementById("facultyDepartment").value.trim(),

        role: "faculty"

    };


    if (
        !faculty.staffId ||
        !faculty.name ||
        !faculty.email ||
        !faculty.password ||
        !faculty.department
    ) {

        alert("Please fill all faculty fields.");

        return;
    }


    try {

        const data = await apiRequest(

            "/staff",

            "POST",

            faculty

        );


        alert(data.message || "Faculty added successfully!");

        hideFacultyForm();


        document.querySelectorAll("#facultyForm input")
            .forEach(input => input.value = "");


        await loadDashboard();


    } catch (error) {

        alert(error.message);

    }

}


// ==========================================
// EDIT FACULTY
// ==========================================

async function editFaculty(id) {

    const f = allFaculty.find(item => item._id === id);

    if (!f) return;


    const name = prompt("Enter Faculty Name:", f.name);

    if (name === null) return;


    const email = prompt("Enter Email:", f.email);

    if (email === null) return;


    const department = prompt("Enter Department:", f.department);

    if (department === null) return;


    if (
        !name.trim() ||
        !email.trim() ||
        !department.trim()
    ) {

        alert("Please enter valid faculty details.");

        return;
    }


    try {

        const data = await apiRequest(

            `/staff/${id}`,

            "PATCH",

            {
                name: name.trim(),
                email: email.trim(),
                department: department.trim()
            }

        );


        alert(data.message || "Faculty updated successfully!");

        await loadDashboard();


    } catch (error) {

        alert(error.message);

    }

}


// ==========================================
// DELETE FACULTY
// ==========================================

async function deleteFaculty(id) {

    if (!confirm("Do you want to delete this faculty?")) return;


    try {

        const data = await apiRequest(

            `/staff/${id}`,

            "DELETE"

        );


        alert(data.message || "Faculty deleted successfully!");

        await loadDashboard();


    } catch (error) {

        alert(error.message);

    }

}


// ==========================================
// SEARCH STUDENTS BY ID OR NAME
// ==========================================

function filterStudents() {

    const searchValue = document
        .getElementById("studentSearch")
        .value
        .toLowerCase()
        .trim();


    const branchValue = document
        .getElementById("branchFilter")
        .value
        .toLowerCase();


    const filteredStudents = allStudents.filter(student => {

        const studentId = (student.studentId || "").toLowerCase();

        const studentName = (student.name || "").toLowerCase();

        const studentBranch = (student.branch || "").toLowerCase();


        const matchesSearch =
            studentId.includes(searchValue) ||
            studentName.includes(searchValue);


        const matchesBranch =
            !branchValue ||
            studentBranch === branchValue;


        return matchesSearch && matchesBranch;

    });


    displayStudents(filteredStudents);

}
function filterFaculty() {

    const searchValue = document
        .getElementById("facultySearch")
        .value
        .toLowerCase()
        .trim();


    const filteredFaculty = allFaculty.filter(member => {

        const name = (member.name || "").toLowerCase();

        const email = (member.email || "").toLowerCase();


        return (
            name.includes(searchValue) ||
            email.includes(searchValue)
        );

    });


    displayFaculty(filteredFaculty);

}
function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("loginType");

    localStorage.removeItem("user");


    window.location.href = "index.html";

}
loadDashboard();
