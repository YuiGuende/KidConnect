// Sample data
let children = [
    {
        id: 1,
        name: "Nguyễn Minh An",
        age: 8,
        gender: "male",
        birthday: "2016-03-15",
        hobbies: "Đọc sách, vẽ tranh",
        address: "Hà Nội",
        description: "Con yêu thích học toán và khoa học",
        avatar: null,
    },
    {
        id: 2,
        name: "Nguyễn Phương Linh",
        age: 6,
        gender: "female",
        birthday: "2018-07-20",
        hobbies: "Múa, hát, chơi piano",
        address: "Hà Nội",
        description: "Con rất năng động và thích nghệ thuật",
        avatar: null,
    },
]

let parentData = {
    father: {
        name: "Nguyễn Văn A",
        birthday: "1985-05-15",
        id: "001085012345",
        phone: "0912345678",
        job: "Kỹ sư phần mềm",
        email: "nguyenvana@email.com",
        avatar: null,
    },
    mother: {
        name: "Trần Thị B",
        birthday: "1987-08-20",
        id: "001087023456",
        phone: "0987654321",
        job: "Giáo viên",
        email: "tranthib@email.com",
        avatar: null,
    },
}

let currentParent = "father"
let editingChildId = null
let currentChildAvatar = null

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage()
    switchParentTab(currentParent)
    renderChildren()
    updateStats()

    // Form submit handlers
    document.getElementById("parentForm").addEventListener("submit", handleParentSubmit)
    document.getElementById("childForm").addEventListener("submit", handleChildSubmit)
    document.getElementById("searchInput").addEventListener("input", searchChildren)
})

// Parent form functions
function toggleEditParent() {
    const form = document.getElementById("parentForm")
    const inputs = form.querySelectorAll(".form-input")
    const actions = document.getElementById("parentFormActions")

    inputs.forEach((input) => {
        input.disabled = !input.disabled
    })

    actions.style.display = actions.style.display === "none" ? "flex" : "none"
}

function cancelEditParent() {
    const form = document.getElementById("parentForm")
    const inputs = form.querySelectorAll(".form-input")
    const actions = document.getElementById("parentFormActions")

    inputs.forEach((input) => {
        input.disabled = true
    })

    actions.style.display = "none"
    loadParentData(currentParent)
}

function handleParentSubmit(e) {
    e.preventDefault()

    // Get form data
    parentData[currentParent] = {
        ...parentData[currentParent],
        name: document.getElementById("parentName").value,
        birthday: document.getElementById("parentBirthday").value,
        id: document.getElementById("parentId").value,
        phone: document.getElementById("parentPhone").value,
        job: document.getElementById("parentJob").value,
        email: document.getElementById("parentEmail").value,
    }

    saveToLocalStorage()
    alert("Đã lưu thông tin phụ huynh thành công!")
    toggleEditParent()
}

// Children functions
function renderChildren() {
    renderChildrenList(children)
    updateStats()
}

function renderChildrenList(childrenList) {
    const grid = document.getElementById("childrenGrid")

    if (childrenList.length === 0) {
        grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <p>${document.getElementById("searchInput").value ? "Không tìm thấy kết quả" : "Chưa có hồ sơ con nào"}</p>
        ${!document.getElementById("searchInput").value ? '<button class="btn-primary" onclick="openChildModal()">Thêm Hồ Sơ Đầu Tiên</button>' : ""}
      </div>
    `
        return
    }

    grid.innerHTML = childrenList
        .map(
            (child) => `
    <div class="child-card">
      <div class="child-avatar">
        ${child.avatar ? `<img src="${child.avatar}" alt="${child.name}">` : child.name.charAt(0)}
      </div>
      <div class="child-name">${child.name}</div>
      <div class="child-info"><strong>Tuổi:</strong> ${child.age} tuổi</div>
      <div class="child-info"><strong>Giới tính:</strong> ${getGenderText(child.gender)}</div>
      ${child.hobbies ? `<div class="child-info"><strong>Sở thích:</strong> ${child.hobbies}</div>` : ""}
      ${child.address ? `<div class="child-info"><strong>Địa chỉ:</strong> ${child.address}</div>` : ""}
      ${child.description ? `<div class="child-info"><strong>Mô tả:</strong> ${child.description}</div>` : ""}
      <div class="child-actions">
        <button class="btn-icon" onclick="editChild(${child.id})">Chỉnh sửa</button>
        <button class="btn-icon btn-delete" onclick="deleteChild(${child.id})">Xóa</button>
      </div>
    </div>
  `,
        )
        .join("")
}

function getGenderText(gender) {
    const genders = {
        male: "Nam",
        female: "Nữ",
        other: "Khác",
    }
    return genders[gender] || gender
}

function openChildModal(childId = null) {
    const modal = document.getElementById("childModal")
    const form = document.getElementById("childForm")
    const title = document.getElementById("modalTitle")

    editingChildId = childId
    currentChildAvatar = null

    if (childId) {
        const child = children.find((c) => c.id === childId)
        if (child) {
            title.textContent = "Chỉnh Sửa Hồ Sơ Con"
            document.getElementById("childName").value = child.name
            document.getElementById("childAge").value = child.age
            document.getElementById("childGender").value = child.gender
            document.getElementById("childBirthday").value = child.birthday || ""
            document.getElementById("childHobbies").value = child.hobbies || ""
            document.getElementById("childAddress").value = child.address || ""
            document.getElementById("childDescription").value = child.description || ""

            currentChildAvatar = child.avatar
            const preview = document.getElementById("childAvatarPreview")
            if (child.avatar) {
                preview.innerHTML = `<img src="${child.avatar}" alt="Avatar">`
            } else {
                preview.innerHTML = `
          <svg width="50" height="50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `
            }
        }
    } else {
        title.textContent = "Thêm Hồ Sơ Con"
        form.reset()
        document.getElementById("childAvatarPreview").innerHTML = `
      <svg width="50" height="50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `
    }

    modal.classList.add("active")
    document.body.style.overflow = "hidden"
}

function closeChildModal() {
    const modal = document.getElementById("childModal")
    const form = document.getElementById("childForm")

    modal.classList.remove("active")
    document.body.style.overflow = ""
    form.reset()
    editingChildId = null
    currentChildAvatar = null
}

function editChild(id) {
    openChildModal(id)
}

function deleteChild(id) {
    if (confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) {
        children = children.filter((c) => c.id !== id)
        saveToLocalStorage()
        renderChildren()
        alert("Đã xóa hồ sơ thành công!")
    }
}

function handleChildSubmit(e) {
    e.preventDefault()

    const childData = {
        name: document.getElementById("childName").value,
        age: Number.parseInt(document.getElementById("childAge").value),
        gender: document.getElementById("childGender").value,
        birthday: document.getElementById("childBirthday").value,
        hobbies: document.getElementById("childHobbies").value,
        address: document.getElementById("childAddress").value,
        description: document.getElementById("childDescription").value,
        avatar: currentChildAvatar,
    }

    if (editingChildId) {
        const index = children.findIndex((c) => c.id === editingChildId)
        if (index !== -1) {
            children[index] = { ...children[index], ...childData }
            alert("Đã cập nhật hồ sơ thành công!")
        }
    } else {
        const newChild = {
            id: Date.now(),
            ...childData,
        }
        children.push(newChild)
        alert("Đã thêm hồ sơ thành công!")
    }

    saveToLocalStorage()
    renderChildren()
    closeChildModal()
}

// Parent tab switching function
function switchParentTab(parent) {
    currentParent = parent

    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active")
        if (btn.dataset.parent === parent) {
            btn.classList.add("active")
        }
    })

    // Load parent data
    loadParentData(parent)
}

function loadParentData(parent) {
    const data = parentData[parent]
    document.getElementById("parentName").value = data.name
    document.getElementById("parentBirthday").value = data.birthday
    document.getElementById("parentId").value = data.id
    document.getElementById("parentPhone").value = data.phone
    document.getElementById("parentJob").value = data.job
    document.getElementById("parentEmail").value = data.email

    // Load avatar
    const preview = document.getElementById("parentAvatarPreview")
    if (data.avatar) {
        preview.innerHTML = `<img src="${data.avatar}" alt="Avatar">`
    } else {
        preview.innerHTML = `
      <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `
    }
}

// Avatar handling functions
function handleParentAvatarChange(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
            parentData[currentParent].avatar = e.target.result
            document.getElementById("parentAvatarPreview").innerHTML = `<img src="${e.target.result}" alt="Avatar">`
            saveToLocalStorage()
        }
        reader.readAsDataURL(file)
    }
}

function removeParentAvatar() {
    if (confirm("Bạn có chắc muốn xóa ảnh đại diện?")) {
        parentData[currentParent].avatar = null
        loadParentData(currentParent)
        saveToLocalStorage()
    }
}

function handleChildAvatarChange(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
            currentChildAvatar = e.target.result
            document.getElementById("childAvatarPreview").innerHTML = `<img src="${e.target.result}" alt="Avatar">`
        }
        reader.readAsDataURL(file)
    }
}

// Statistics calculation
function updateStats() {
    const totalChildren = children.length
    const avgAge = totalChildren > 0 ? Math.round(children.reduce((sum, child) => sum + child.age, 0) / totalChildren) : 0

    document.getElementById("totalChildren").textContent = totalChildren
    document.getElementById("avgAge").textContent = avgAge
}

// Search functionality
function searchChildren() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase()
    const filteredChildren = children.filter((child) => child.name.toLowerCase().includes(searchTerm))
    renderChildrenList(filteredChildren)
}

// LocalStorage functions for data persistence
function saveToLocalStorage() {
    localStorage.setItem("kidconnect_parents", JSON.stringify(parentData))
    localStorage.setItem("kidconnect_children", JSON.stringify(children))
}

function loadFromLocalStorage() {
    const savedParents = localStorage.getItem("kidconnect_parents")
    const savedChildren = localStorage.getItem("kidconnect_children")

    if (savedParents) {
        parentData = JSON.parse(savedParents)
    }

    if (savedChildren) {
        children = JSON.parse(savedChildren)
    }
}

// Export data functionality
function exportData() {
    const dataToExport = {
        parents: parentData,
        children: children,
        exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `kidconnect-family-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert("Đã export dữ liệu thành công!")
}

// Close modal when clicking outside
document.getElementById("childModal")?.addEventListener("click", function (e) {
    if (e.target === this) {
        closeChildModal()
    }
})
