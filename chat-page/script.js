// Mock Data
const mockConversations = [
    {
        id: 1,
        name: "Công viên Lotte Mart",
        avatar: "../pictures/lotteMart.png",
        lastMessage: "Chào mừng bạn đến với nhóm!",
        time: "10:30",
        unread: 3,
        playground: {
            name: "Công viên Lotte Mart Quận 7",
            image: "../pictures/lotteMart.png",
            rating: 4.8,
            distance: "2.5 km",
            address: "Đường Nguyễn Hữu Thọ, Tân Hưng, Quận 7, TP.HCM",
        },
        members: [
            { id: 1, name: "Nguyễn Minh Anh", avatar: "../pictures/parent-3.png", role: "Admin" },
            { id: 2, name: "Trần Văn Hùng", avatar: "../pictures/parent-2.png", role: "Thành viên" },
            { id: 3, name: "Lê Thị Hương", avatar: "../pictures/parent-1.png", role: "Thành viên" },
        ],
        messages: [
            {
                id: 1,
                sender: "Nguyễn Minh Anh",
                avatar: "../pictures/parent-3.png",
                content: "Chào mọi người! Hôm nay trời đẹp, ai rủ nhau đi công viên không?",
                time: "10:15",
                type: "received",
            },
            { id: 2, sender: "You", content: "Mình có thể đi được! Mấy giờ nhỉ?", time: "10:18", type: "sent" },
            {
                id: 3,
                sender: "Trần Văn Hùng",
                avatar: "../pictures/parent-2.png",
                content: "3 giờ chiều được không các bạn?",
                time: "10:25",
                type: "received",
            },
            { id: 4, sender: "You", content: "Ok, hẹn gặp lúc 3h nhé!", time: "10:30", type: "sent" },
        ],
    },
    {
        id: 2,
        name: "Khu vui chơi Dream Land",
        avatar: "../pictures/dreamLand.png",
        lastMessage: "Có ai muốn đi cuối tuần không?",
        time: "Hôm qua",
        unread: 0,
        playground: {
            name: "Dream Land Indoor Playground",
            image: "../pictures/dreamLand.png",
            rating: 4.5,
            distance: "5.2 km",
            address: "TTTM Vivo City, Quận 7, TP.HCM",
        },
        members: [
            { id: 1, name: "Phạm Thu Hà", avatar: "../pictures/parent-1.png", role: "Admin" },
            { id: 2, name: "Hoàng Minh Tuấn", avatar: "../pictures/parent-2.png", role: "Thành viên" },
        ],
        messages: [
            {
                id: 1,
                sender: "Phạm Thu Hà",
                avatar: "../pictures/parent-1.png",
                content: "Có ai muốn đi cuối tuần không?",
                time: "Hôm qua",
                type: "received",
            },
        ],
    },
    {
        id: 3,
        name: "Sân chơi Crescent Mall",
        avatar: "../pictures/crea.png",
        lastMessage: "Cảm ơn mọi người đã tham gia!",
        time: "T7",
        unread: 0,
        playground: {
            name: "Khu vui chơi Crescent Mall",
            image: "../pictures/crea.png",
            rating: 4.6,
            distance: "3.8 km",
            address: "TTTM Crescent Mall, Phú Mỹ Hưng, Quận 7, TP.HCM",
        },
        members: [{ id: 1, name: "Đỗ Thị Lan", avatar: "../pictures/parent-1.png", role: "Admin" }],
        messages: [
            {
                id: 1,
                sender: "Đỗ Thị Lan",
                avatar: "../pictures/parent-1.png",
                content: "Cảm ơn mọi người đã tham gia!",
                time: "T7",
                type: "received",
            },
        ],
    },
]

const mockFriends = [
    { id: 4, name: "Võ Thị Mai", avatar: "../pictures/parent-3.png", status: "Đang hoạt động" },
    { id: 5, name: "Đinh Văn Nam", avatar: "../pictures/parent-2.png", status: "Hoạt động 2 giờ trước" },
    { id: 6, name: "Bùi Thị Hồng", avatar: "../pictures/parent-1.png", status: "Đang hoạt động" },
]

// State
let currentConversation = null
let selectedFriends = []
let uploadedImage = null

// DOM Elements
const sidebar = document.getElementById("sidebar")
const conversationList = document.getElementById("conversationList")
const chatMain = document.getElementById("chatMain")
const chatHeader = document.getElementById("chatHeader")
const chatMessages = document.getElementById("chatMessages")
const chatInputContainer = document.getElementById("chatInputContainer")
const infoPanel = document.getElementById("infoPanel")
const messageInput = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const backBtn = document.getElementById("backBtn")
const infoBtn = document.getElementById("infoBtn")
const closeInfoBtn = document.getElementById("closeInfoBtn")
const searchInput = document.getElementById("searchInput")
const newChatBtn = document.getElementById("newChatBtn")
const createGroupModal = document.getElementById("createGroupModal")
const closeModalBtn = document.getElementById("closeModalBtn")
const cancelBtn = document.getElementById("cancelBtn")
const createGroupForm = document.getElementById("createGroupForm")
const imagePreview = document.getElementById("imagePreview")
const playgroundImageInput = document.getElementById("playgroundImageInput")
const friendsList = document.getElementById("friendsList")

// Initialize
function init() {
    renderConversations(mockConversations)
    setupEventListeners()
}

// Render Conversations
function renderConversations(conversations) {
    conversationList.innerHTML = ""
    conversations.forEach((conv) => {
        const item = document.createElement("div")
        item.className = "conversation-item"
        item.dataset.id = conv.id

        item.innerHTML = `
            <img class="conversation-avatar" src="${conv.avatar}" alt="${conv.name}">
            <div class="conversation-content">
                <div class="conversation-header">
                    <span class="conversation-name">${conv.name}</span>
                    <span class="conversation-time">${conv.time}</span>
                </div>
                <p class="conversation-message">${conv.lastMessage}</p>
            </div>
            ${conv.unread > 0 ? `<span class="conversation-badge">${conv.unread}</span>` : ""}
        `

        item.addEventListener("click", () => openConversation(conv.id))
        conversationList.appendChild(item)
    })
}

// Open Conversation
function openConversation(id) {
    const conversation = mockConversations.find((c) => c.id === id)
    if (!conversation) return

    currentConversation = conversation

    // Update active state
    document.querySelectorAll(".conversation-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.id == id)
    })

    // Hide empty state
    document.querySelector(".empty-state").style.display = "none"

    // Show chat elements
    chatHeader.style.display = "flex"
    chatMessages.style.display = "flex"
    chatInputContainer.style.display = "flex"

    // Update header
    document.getElementById("chatAvatar").src = conversation.avatar
    document.getElementById("chatName").textContent = conversation.name
    document.getElementById("chatStatus").textContent = `${conversation.members.length} thành viên`

    // Render messages
    renderMessages(conversation.messages)

    // Mobile: hide sidebar, show chat
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("active")
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
}

// Render Messages
function renderMessages(messages) {
    chatMessages.innerHTML = '<div class="date-divider"><span>Hôm nay</span></div>'

    messages.forEach((msg) => {
        const messageDiv = document.createElement("div")
        messageDiv.className = `message ${msg.type}`

        messageDiv.innerHTML = `
            ${msg.type === "received" ? `<img class="message-avatar" src="${msg.avatar}" alt="${msg.sender}">` : ""}
            <div class="message-content">
                <div class="message-bubble">${msg.content}</div>
                <span class="message-time">${msg.time}</span>
            </div>
        `

        chatMessages.appendChild(messageDiv)
    })
}

// Send Message
function sendMessage() {
    const text = messageInput.value.trim()
    if (!text || !currentConversation) return

    const newMessage = {
        id: Date.now(),
        sender: "You",
        content: text,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        type: "sent",
    }

    currentConversation.messages.push(newMessage)

    const messageDiv = document.createElement("div")
    messageDiv.className = "message sent"
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">${text}</div>
            <span class="message-time">${newMessage.time}</span>
        </div>
    `

    chatMessages.appendChild(messageDiv)
    messageInput.value = ""
    chatMessages.scrollTop = chatMessages.scrollHeight
}

// Open Info Panel
function openInfoPanel() {
    if (!currentConversation) return

    infoPanel.classList.add("active")

    // Update playground info
    document.getElementById("playgroundImage").src = currentConversation.playground.image
    document.getElementById("playgroundName").textContent = currentConversation.playground.name
    document.getElementById("playgroundRating").textContent = currentConversation.playground.rating
    document.getElementById("playgroundDistance").textContent = currentConversation.playground.distance
    document.getElementById("playgroundAddress").textContent = currentConversation.playground.address

    // Update members
    document.getElementById("memberCount").textContent = `(${currentConversation.members.length})`
    const membersList = document.getElementById("membersList")
    membersList.innerHTML = ""

    currentConversation.members.forEach((member) => {
        const memberDiv = document.createElement("div")
        memberDiv.className = "member-item"
        memberDiv.innerHTML = `
            <img class="member-avatar" src="${member.avatar}" alt="${member.name}">
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-role">${member.role}</div>
            </div>
        `
        membersList.appendChild(memberDiv)
    })
}

// Search Conversations
function searchConversations(query) {
    const filtered = mockConversations.filter((conv) => conv.name.toLowerCase().includes(query.toLowerCase()))
    renderConversations(filtered)
}

// Open Create Group Modal
function openCreateGroupModal() {
    createGroupModal.classList.add("active")
    renderFriendsList()
    resetCreateGroupForm()
}

// Close Create Group Modal
function closeCreateGroupModal() {
    createGroupModal.classList.remove("active")
    resetCreateGroupForm()
}

// Render Friends List
function renderFriendsList() {
    friendsList.innerHTML = ""
    mockFriends.forEach((friend) => {
        const friendItem = document.createElement("div")
        friendItem.className = "friend-item"
        friendItem.dataset.id = friend.id

        friendItem.innerHTML = `
      <img class="friend-avatar" src="${friend.avatar}" alt="${friend.name}">
      <div class="friend-info">
        <div class="friend-name">${friend.name}</div>
        <div class="friend-status">${friend.status}</div>
      </div>
      <div class="friend-checkbox">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    `

        friendItem.addEventListener("click", () => toggleFriendSelection(friend.id, friendItem))
        friendsList.appendChild(friendItem)
    })
}

// Toggle Friend Selection
function toggleFriendSelection(friendId, element) {
    const index = selectedFriends.indexOf(friendId)
    if (index > -1) {
        selectedFriends.splice(index, 1)
        element.classList.remove("selected")
    } else {
        selectedFriends.push(friendId)
        element.classList.add("selected")
    }
    console.log("[v0] Selected friends:", selectedFriends)
}

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        uploadedImage = e.target.result
        imagePreview.innerHTML = `
      <img src="${e.target.result}" alt="Preview">
      <button type="button" class="image-remove-btn" onclick="removeUploadedImage()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    `
        imagePreview.classList.add("has-image")
        console.log("[v0] Image uploaded successfully")
    }
    reader.readAsDataURL(file)
}

// Remove Uploaded Image
function removeUploadedImage() {
    uploadedImage = null
    playgroundImageInput.value = ""
    imagePreview.classList.remove("has-image")
    imagePreview.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <p class="image-preview-text">Nhấn để chọn ảnh</p>
  `
    console.log("[v0] Image removed")
}

// Handle Create Group Form Submit
function handleCreateGroupSubmit(event) {
    event.preventDefault();

    // Lấy dữ liệu từ các ID đã sửa (có đuôi -input)
    const groupName = document.getElementById("groupName-input").value.trim();
    const playgroundName = document.getElementById("playgroundName-input").value.trim();
    const playgroundAddress = document.getElementById("playgroundAddress-input").value.trim();
    const playgroundDescription = document.getElementById("playgroundDescription-input").value.trim();

    if (!groupName || !playgroundName || !playgroundAddress) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
    }

    // Logic tạo object mới (Giữ nguyên như cũ)
    const newConversation = {
        id: Date.now(), // Sử dụng timestamp để không trùng ID
        name: groupName,
        avatar: uploadedImage || "../pictures/lotteMart.png",
        lastMessage: "Nhóm chat mới được tạo",
        time: "Vừa xong",
        unread: 0,
        playground: {
            name: playgroundName,
            image: uploadedImage || "../pictures/lotteMart.png",
            rating: 5.0,
            distance: "0 km",
            address: playgroundAddress,
            description: playgroundDescription,
        },
        members: [
            { id: 0, name: "Bạn", avatar: "../pictures/parent-1.png", role: "Admin" },
            ...mockFriends.filter((f) => selectedFriends.includes(f.id)).map((f) => ({ ...f, role: "Thành viên" })),
        ],
        messages: [{
            id: 1,
            sender: "System",
            content: `Chào mừng đến với nhóm ${groupName}! 🎉`,
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            type: "received",
        }],
    };

    mockConversations.unshift(newConversation);
    renderConversations(mockConversations);
    closeCreateGroupModal();
    openConversation(newConversation.id); // Mở ngay nhóm vừa tạo
}

// Reset Create Group Form
function resetCreateGroupForm() {
    createGroupForm.reset()
    selectedFriends = []
    uploadedImage = null
    imagePreview.classList.remove("has-image")
    imagePreview.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
    <p class="image-preview-text">Nhấn để chọn ảnh</p>
  `
    document.querySelectorAll(".friend-item").forEach((item) => item.classList.remove("selected"))
}

// Event Listeners
function setupEventListeners() {
    sendBtn.addEventListener("click", sendMessage)

    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    })

    infoBtn.addEventListener("click", openInfoPanel)
    closeInfoBtn.addEventListener("click", () => infoPanel.classList.remove("active"))

    backBtn.addEventListener("click", () => {
        sidebar.classList.add("active")
    })

    searchInput.addEventListener("input", (e) => {
        searchConversations(e.target.value)
    })

    newChatBtn.addEventListener("click", openCreateGroupModal)
    closeModalBtn.addEventListener("click", closeCreateGroupModal)
    cancelBtn.addEventListener("click", closeCreateGroupModal)
    createGroupForm.addEventListener("submit", handleCreateGroupSubmit)

    // Image upload
    imagePreview.addEventListener("click", () => playgroundImageInput.click())
    playgroundImageInput.addEventListener("change", handleImageUpload)

    // Close modal on overlay click
    createGroupModal.addEventListener("click", (e) => {
        if (e.target === createGroupModal) {
            closeCreateGroupModal()
        }
    })

    // Mobile sidebar toggle
    if (window.innerWidth <= 768) {
        sidebar.classList.add("active")
    }
}

// Make removeUploadedImage available globally
window.removeUploadedImage = removeUploadedImage

// Initialize app
init()

console.log("[v0] Chat messenger initialized successfully")
