const projectData = [
    {
        id: 1,
        title: "Form Login",
        category: "web-app",
        image: "/images/CardImage/Halaman-Login.png",
        description: "Membuat Halaman Login dengan html, css, dan javascript",
        link: "https://samsulmaarif01.github.io/Form-Login/"
    },
    {
        id: 2,
        title: "Kalkulator",
        category: "web-app",
        image: "/images/CardImage/Kalkulator.png",
        description: "Membuat Kalkulator pada web dengan html, css, dan javascript",
        link: "https://samsulmaarif01.github.io/Kalkulator/"
    },
    {
        id: 3,
        title: "Game Tebak Angka",
        category: "game",
        image: "/images/CardImage/Game-Tebak-Angka.png",
        description: "Sebuah game sederhana yaitu game menebak sebuah angka",
        link: "https://samsulmaarif01.github.io/Game-tebak-angka/"
    },
    {
        id: 4,
        title: "Dashboard Admin",
        category: "dashboard",
        image: "/images/CardImage/Blog-Dasboard-Admin.png",
        description: "Sebuah dashboard admin untuk memonitoring blog",
        link: "https://samsulmaarif01.github.io/Dasbord-Admin-view/"
    },
    {
        id: 5,
        title: "Dashboard Karyawan",
        category: "dashboard",
        image: "/images/CardImage/Admin-Dashboard-karyawan.png",
        description: "Sebuah dashboard admin untuk memonitoring karyawan",
        link: "https://samsulmaarif01.github.io/Samsul_Maarif_05TPLP007/"
    },
    {
        id: 6,
        title: "Game Tetris",
        category: "game",
        image: "/images/CardImage/Tetris-Game.png",
        description: "Sebuah Game Tetris yang sangat seru",
        link: "https://samsulmaarif01.github.io/Game-Tetris/"
    },
    {
        id: 7,
        title: "Web Pengumpulan Tugas",
        category: "web-app",
        image: "/images/CardImage/Portofolio-Mahasiswa.png",
        description: "Web Pengumpulan Tugas Mahasiswa",
        link: "https://web-pengumpulan-tugas-mahasiswa-t5km.vercel.app/"
    },
    {
        id: 8,
        title: "Grafik Laporan Penjualan",
        category: "dashboard",
        image: "/images/CardImage/Grafik-laporan-Perbandingan-penjualan.png",
        description: "Grafik perbandingan laporan penjualan",
        link: "https://samsulmaarif01.github.io/chart-perbandingan-laporan-penjualan/"
    }
];

class ProjectGallery {
    constructor() {
        this.projectGrid = document.getElementById('project-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.activeCategory = 'all';
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.renderProjects();
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active category
                this.activeCategory = button.dataset.category;
                
                // Update button styles
                this.filterButtons.forEach(btn => {
                    btn.classList.remove('bg-blue-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                button.classList.remove('bg-gray-200', 'text-gray-700');
                button.classList.add('bg-blue-600', 'text-white');
                
                // Render filtered projects
                this.renderProjects();
            });
        });
    }

    renderProjects() {
        // Clear current projects
        this.projectGrid.innerHTML = '';
        
        // Filter projects
        const filteredProjects = this.activeCategory === 'all'
            ? projectData
            : projectData.filter(project => project.category === this.activeCategory);

        // Render filtered projects
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'transform transition-all duration-300 opacity-0 translate-y-4';
            
            projectCard.innerHTML = `
               <div class="card">
                <div class="card-content">
                    <img src="${project.image}" 
                        alt="${project.title}" 
                        class="card-image">
                    <div class="card-overlay">
                        <a href="${project.link}" 
                        target="_blank" 
                        class="card-button">
                            Lihat Project
                        </a>
                    </div>
                </div>
                <div class="card-description">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-text">${project.description}</p>
                    <span class="card-category">
                        ${project.category}
                    </span>
                </div>
            </div>

            `;

            this.projectGrid.appendChild(projectCard);

            // Trigger animation
            setTimeout(() => {
                projectCard.classList.remove('opacity-0', 'translate-y-4');
            }, 50);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectGallery();
});