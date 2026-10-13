const complaintForm = document.getElementById("complaintForm");
const complaintTableBody = document.getElementById("complaintTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const trackingInput = document.getElementById("trackingInput");
const trackBtn = document.getElementById("trackBtn");
const trackingResult = document.getElementById("trackingResult");
const toast = document.getElementById("toast");
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

let complaints = JSON.parse(localStorage.getItem("grievanceComplaints")) || [
    {
        id: "GRV-2026-1001",
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        category: "Water Supply",
        location: "Andheri East, Mumbai",
        subject: "Irregular water supply",
        description: "Water supply has been irregular in our area for the last five days.",
        date: "02 Sep 2026",
        status: "In Progress",
        response: "The complaint has been forwarded to the local water department.",
        history: [
            {
                status: "Complaint Registered",
                date: "02 Sep 2026"
            },
            {
                status: "Assigned to Water Department",
                date: "02 Sep 2026"
            }
        ]
    },
    {
        id: "GRV-2026-1002",
        name: "Priya Patil",
        email: "priya@example.com",
        phone: "9988776655",
        category: "Road and Transport",
        location: "Borivali West, Mumbai",
        subject: "Potholes on main road",
        description: "Several potholes are present on the main road.",
        date: "01 Sep 2026",
        status: "Pending",
        response: "Your complaint is waiting for officer verification.",
        history: [
            {
                status: "Complaint Registered",
                date: "01 Sep 2026"
            }
        ]
    },
    {
        id: "GRV-2026-1003",
        name: "Amit Verma",
        email: "amit@example.com",
        phone: "9123456789",
        category: "Sanitation",
        location: "Dadar, Mumbai",
        subject: "Garbage collection issue",
        description: "Garbage has not been collected from our street.",
        date: "30 Aug 2026",
        status: "Resolved",
        response: "The sanitation team has resolved the issue.",
        history: [
            {
                status: "Complaint Registered",
                date: "30 Aug 2026"
            },
            {
                status: "Assigned to Sanitation Department",
                date: "30 Aug 2026"
            },
            {
                status: "Complaint Resolved",
                date: "01 Sep 2026"
            }
        ]
    }
];

function saveComplaints() {
    localStorage.setItem("grievanceComplaints", JSON.stringify(complaints));
}

function generateComplaintId() {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `GRV-${year}-${randomNumber}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

function getStatusClass(status) {
    return status.toLowerCase().replaceAll(" ", "-");
}

function updateStatistics() {
    const total = complaints.length;
    const pending = complaints.filter(item => item.status === "Pending").length;
    const progress = complaints.filter(item => item.status === "In Progress").length;
    const resolved = complaints.filter(item => item.status === "Resolved").length;

    document.getElementById("totalComplaints").textContent = total;
    document.getElementById("pendingComplaints").textContent = pending;
    document.getElementById("progressComplaints").textContent = progress;
    document.getElementById("resolvedComplaints").textContent = resolved;
    document.getElementById("heroTotal").textContent = total;
    document.getElementById("heroResolved").textContent = resolved;
}

function displayComplaints() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch =
            complaint.id.toLowerCase().includes(searchValue) ||
            complaint.name.toLowerCase().includes(searchValue) ||
            complaint.category.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            complaint.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    complaintTableBody.innerHTML = "";

    if (filteredComplaints.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    filteredComplaints.forEach(complaint => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="complaint-id">${complaint.id}</span>
            </td>
            <td>${complaint.name}</td>
            <td>${complaint.category}</td>
            <td>${complaint.date}</td>
            <td>
                <span class="status ${getStatusClass(complaint.status)}">
                    ${complaint.status}
                </span>
            </td>
            <td>
                <button class="view-btn" onclick="viewComplaint('${complaint.id}')">
                    View
                </button>
            </td>
        `;

        complaintTableBody.appendChild(row);
    });
}

function viewComplaint(id) {
    const complaint = complaints.find(item => item.id === id);

    if (!complaint) {
        showToast("Complaint not found.");
        return;
    }

    trackingInput.value = complaint.id;
    displayTrackingResult(complaint);

    document.getElementById("track").scrollIntoView({
        behavior: "smooth"
    });
}

function displayTrackingResult(complaint) {
    const historyHTML = complaint.history.map(item => {
        return `
            <div class="timeline-item">
                <strong>${item.status}</strong>
                <small>${item.date}</small>
            </div>
        `;
    }).join("");

    trackingResult.innerHTML = `
        <div class="result-card">
            <h3>${complaint.id}</h3>

            <p>
                <strong>Citizen:</strong> ${complaint.name}<br>
                <strong>Category:</strong> ${complaint.category}<br>
                <strong>Subject:</strong> ${complaint.subject}<br>
                <strong>Location:</strong> ${complaint.location}<br>
                <strong>Submitted on:</strong> ${complaint.date}<br>
                <strong>Current Status:</strong>
                <span class="status ${getStatusClass(complaint.status)}">
                    ${complaint.status}
                </span>
            </p>

            <p>
                <strong>Officer Response:</strong><br>
                ${complaint.response || "Your complaint is being reviewed."}
            </p>

            <div class="timeline">
                ${historyHTML}
            </div>
        </div>
    `;
}

complaintForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const complaint = {
        id: generateComplaintId(),
        name: document.getElementById("citizenName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        category: document.getElementById("category").value,
        location: document.getElementById("location").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        description: document.getElementById("description").value.trim(),
        date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }),
        status: "Pending",
        response: "Your complaint has been registered and is waiting for officer verification.",
        history: [
            {
                status: "Complaint Registered",
                date: new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
            }
        ]
    };

    complaints.unshift(complaint);
    saveComplaints();
    updateStatistics();
    displayComplaints();

    complaintForm.reset();

    trackingInput.value = complaint.id;
    displayTrackingResult(complaint);

    showToast(`Complaint submitted successfully. ID: ${complaint.id}`);

    setTimeout(() => {
        document.getElementById("track").scrollIntoView({
            behavior: "smooth"
        });
    }, 400);
});

trackBtn.addEventListener("click", function() {
    const enteredId = trackingInput.value.trim().toUpperCase();

    if (!enteredId) {
        trackingResult.innerHTML = `
            <div class="result-card">
                <p>Please enter a complaint ID.</p>
            </div>
        `;
        return;
    }

    const complaint = complaints.find(item => item.id === enteredId);

    if (!complaint) {
        trackingResult.innerHTML = `
            <div class="result-card">
                <p>No complaint found with ID <strong>${enteredId}</strong>.</p>
            </div>
        `;
        return;
    }

    displayTrackingResult(complaint);
});

trackingInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        trackBtn.click();
    }
});

searchInput.addEventListener("input", displayComplaints);
statusFilter.addEventListener("change", displayComplaints);

menuBtn.addEventListener("click", function() {
    nav.classList.toggle("show");
});

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function() {
        nav.classList.remove("show");
    });
});

updateStatistics();
displayComplaints();