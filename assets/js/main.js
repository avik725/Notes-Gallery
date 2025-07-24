document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE_URL}/users/getCurrentUser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then(async (res) => {
      return await res.json();
    })
    .then((data) => {
      if (data.success) {
        //redirect to home from login and register pages if already logged in
        if (
          window.location.pathname.includes("login") ||
          window.location.pathname.includes("register")
        ) {
          window.location.href = "/index.html";
        }
        constructLoggedInHeader(data);
      } else {
        if (
          window.location.pathname.includes("myUploads") ||
          window.location.pathname.includes("upload_notes")
        ) {
          window.location.href = "/index.html";
        }
      }
    });

  window.constructLoggedInHeader = function (data) {
    //replace header tabs if loggin successfull
    document.getElementById("navbarNav").innerHTML = `
        <ul class="navbar-nav pt-2 ps-3 ps-md-4">
                <li class="nav-item">
                  <a class="nav-link me-3 text-black" href="index.html">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link me-3 text-black" href="notes_library.html"
                    >Notes Library</a
                  >
                </li>
                <!-- <li class="nav-item">
                  <a
                    class="d-lg-block d-none nav-link me-3 text-black theme-btn rounded-pill px-3 py-2 font-work-sans"
                    href="login.html"
                    >Login</a
                  >
                  <a
                    class="nav-link d-md-none me-3 text-black"
                    href="login.html"
                    >Login</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="d-lg-block d-none nav-link me-3 text-black theme-btn rounded-pill px-3 py-2 font-work-sans"
                    href="register.html"
                    >Register</a
                  >
                  <a
                    class="nav-link d-md-none me-3 text-black"
                    href="register.html"
                    >Register</a
                  >
                </li> -->
                <li class="nav-item">
                  <a class="nav-link me-3 text-black" href="upload_notes.html"
                    >Upload Notes</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link me-3 text-black" href="myUploads.html"
                    >My Uploads</a
                  >
                </li>
                <li class="nav-item dropdown cursor-pointer">
                    <span class="rounded-circle dropdown-toggle"  data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                       <img src="assets/images/demo_header_profile_pic.png" alt="icon">
                    </span>
                    <ul class="dropdown-menu dropdown-menu-end mt-2 border-0 shadow-lg">
                        <li><a class="dropdown-item" href="#">My Profile</a></li>
                        <li><a class="dropdown-item" href="#" id="logoutBtn">Log Out</a></li>
                    </ul>
                </li>
              </ul>
        `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          return await res.json();
        })
        .then((data) => {
          if (data.success) {
            fireSweetAlert({
              success: data.success,
              message: data.message,
            }).then(() => {
              location.reload();
            });
          } else {
            fireSweetAlert({
              success: data.success,
              message: data.message,
            });
          }
        });
    });
  };

  window.fireSweetAlert = function ({ success, message, timer = 3000 }) {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: success ? "success" : "error",
      title: message,
      showConfirmButton: false,
      timer: timer,
      customClass: {
        popup: success ? "success-toast" : "error-toast",
      },
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  window.buildModal = function (title, url, featured = false) {
    let modalTitle = document.querySelector(".modal-title");
    let modalBody = document.querySelector(".modal-body");
    let modalContent = document.querySelector(".modal-content");
    let modalFooter = modalContent.querySelector(".modal-footer");

    modalTitle.innerHTML = "";
    modalBody.innerHTML = "";

    modalTitle.innerHTML = `<span class="text-capitalize">${title}</span>`;

    modalBody.innerHTML = `<iframe
                      id="pdfPreview"
                      class="pdf-preview h-100 w-100"
                      type="application/pdf"
                      src="${url}#toolbar=0&navpanes=0&scrollbar=1"
                    ></iframe>`;

    if (modalFooter) {
      modalFooter.remove();
    }

    if (featured) {
      let footerHTML = document.createElement("div");
      footerHTML.className = "modal-footer";
      footerHTML.innerHTML = `
          <button type="button" class="btn theme-btn fw-bold rounded-pill py-2 px-3" onclick="downloadNote('${title}','${url}')">
            Download
          </button>
        `;
      modalContent.appendChild(footerHTML);
    }
  };

  window.downloadNote = function (title, fileUrl) {
    const downloadUrl = fileUrl.includes("upload/")
      ? fileUrl.replace("upload/", "upload/fl_attachment/")
      : fileUrl;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
});
