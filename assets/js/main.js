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

        if (window.location.pathname.includes("about")) {
          document.querySelector(
            ".get-involved"
          ).innerHTML += `<a href="upload_notes.html" class="btn border-0 theme-btn rounded-pill fw-bold px-3 py-2">Upload Notes Now !</a>`;
        }

        //Fill Profile Page Values
        if (window.location.pathname.includes("profile")) {
          const profileUpdateForm = document.querySelector("form#profileForm");
          const stream_select = document.querySelector(
            "select[name='prefered_stream']"
          );

          document.querySelector(".profile_card_name").innerText = data?.data?.fullname;
          document.querySelector(".profile_card_email").innerText = data?.data?.email;

          for (let key in data.data) {
            let element =
              profileUpdateForm.querySelector(`input[name='${key}']`) != null
                ? profileUpdateForm.querySelector(`input[name='${key}']`)
                : profileUpdateForm.querySelector(`select[name='${key}']`);

            if (element) {
              if (element.type === "file") {
                if (data.data[key].trim() != "" && data.data[key] != null) {
                  document.querySelector("#profilePreview").src =
                    data.data[key];
                }
              } else if (element.type === "date") {
                element.value = data.data[key]?.split("T")[0] || "";
              } else {
                // Destroy and Render selectpicker again only for that field
                if (element.classList.contains("selectpicker")) {
                  $(element).selectpicker("destroy");
                  element.value = data.data[key];
                  $(element).selectpicker("render");
                } else {
                  element.value = data.data[key];
                }
              }
            }
          }

          fetch(`${API_BASE_URL}/notes/get-streams`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((streamData) => {
              if (streamData.success) {
                let streams = streamData.data;

                // Reset stream select
                $(stream_select).selectpicker("destroy");
                $(stream_select).empty();
                $(stream_select).val();
                $(stream_select).append(
                  '<option value="">Select Stream</option>'
                );

                streams.forEach((stream) => {
                  let option = document.createElement("option");
                  option.value = stream._id;
                  option.textContent = stream.name;
                  option.selected = stream._id === data.data.prefered_stream;
                  stream_select.appendChild(option);
                });

                // Re-render stream dropdown
                $(stream_select).selectpicker("render");
              }
            });
        }

      } else {
        if (
          window.location.pathname.includes("myUploads") ||
          window.location.pathname.includes("upload_notes") ||
          window.location.pathname.includes("profile")
        ) {
          window.location.href = "/index.html";
        }

        if (window.location.pathname.includes("about")) {
          document.querySelector(
            ".get-involved"
          ).innerHTML += `<a href="register.html" class="btn border-0 theme-btn rounded-pill fw-bold px-3 py-2">Register Now !</a>`;
        }
      }
    });

  window.constructLoggedInHeader = function (data) {
    let isTableOrMobile =
      window.innerWidth < 770 ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    window.addEventListener("resize", () => {
      isTableOrMobile = window.innerWidth < 770;
    });
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
                ${
                  isTableOrMobile
                    ? `
                  <li class="nav-item">
                    <a class="nav-link me-3 text-black" href="profile.html"
                      >My Profile</a
                    >
                  </li>
                  <li class="nav-item">
                    <a class="nav-link me-3 text-black" href="#" id="logoutBtn">Log Out</a>
                  </li>
                  `
                    : `
                  <li class="nav-item dropdown cursor-pointer">
                    <span class="rounded-circle dropdown-toggle"  data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                       <img src="${
                         data.data.profile_pic.trim() !== "" &&
                         data.data.profile_pic !== null
                           ? data.data.profile_pic
                           : "assets/images/user_default_logo.png"
                       }" alt="icon" class="rounded-circle" style="width: 40px;">
                    </span>
                    <ul class="dropdown-menu dropdown-menu-end mt-2 border-0 shadow-lg">
                        <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
                        <li><a class="dropdown-item" href="#" id="logoutBtn">Log Out</a></li>
                    </ul>
                  </li>
                  `
                }
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
          fireSweetAlert({
            success: data.success,
            message: data.message,
          }).then(() => {
            if (data.success) {
              location.reload();
            }
          });
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
    const modalTitle = document.querySelector(".modal-title");
    const modalBody = document.querySelector(".modal-body");
    const modalContent = document.querySelector(".modal-content");
    const modalFooter = modalContent.querySelector(".modal-footer");

    modalTitle.innerHTML = `<span class="text-capitalize">${title}</span>`;
    modalBody.innerHTML = `<div id="modalPdfContainer" style="width: 100%; overflow-y: auto;"></div>`;

    if (modalFooter) modalFooter.remove();

    if (featured) {
      const footerHTML = document.createElement("div");
      footerHTML.className = "modal-footer";
      footerHTML.innerHTML = `
      <button type="button" class="btn theme-btn fw-bold rounded-pill py-2 px-3" onclick="downloadNote('${title}','${url}')">
        Download
      </button>
    `;
      modalContent.appendChild(footerHTML);
    }

    setTimeout(() => {
      const container = document.getElementById("modalPdfContainer");
      const containerWidth = container.clientWidth || 500;

      pdfjsLib
        .getDocument(url)
        .promise.then((pdf) => {
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then((page) => {
              const unscaledViewport = page.getViewport({ scale: 1 });
              const scale = containerWidth / unscaledViewport.width;
              const viewport = page.getViewport({ scale });

              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              canvas.style.width = "100%";
              canvas.style.marginBottom = "20px";

              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };

              page.render(renderContext);
              container.appendChild(canvas);
            });
          }
        })
        .catch((error) => {
          container.innerHTML = `<p class="text-danger">Failed to load PDF: ${error.message}</p>`;
        });
    }, 800);
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

  window.reinitializeTooltips = function () {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].forEach((el) => new bootstrap.Tooltip(el));
  };
});
