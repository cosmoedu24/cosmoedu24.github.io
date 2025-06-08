/**
 * 카드 링크 생성 및 관리 클래스
 * Google Sheets 데이터를 기반으로 동적 카드 UI를 생성합니다.
 */

class CardLinkManager {
    constructor() {
        this.currentData = [];
        this.categories = new Set();
    }

    /**
     * 페이지 초기화
     */
    async init() {
        try {
            console.log('CardLinkManager 초기화 시작');
            
            // 로딩 표시
            this.showLoading();
            
            // Google Sheets 데이터 로드
            const data = await window.googleSheetsAPI.getComputerData();
            this.currentData = data;
            
            // 카테고리 추출 및 UI 생성
            this.extractCategories();
            this.createTabsAndContent();
            
            console.log('CardLinkManager 초기화 완료');
            
        } catch (error) {
            console.error('초기화 오류:', error);
            this.showError(error.message);
        }
    }

    /**
     * 로딩 표시
     */
    showLoading() {
        const container = document.getElementById('content-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">로딩 중...</span>
                    </div>
                    <p class="mt-3">데이터를 불러오는 중입니다...</p>
                </div>
            `;
        }
    }

    /**
     * 오류 표시
     */
    showError(message) {
        const container = document.getElementById('content-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">오류 발생!</h4>
                    <p>${message}</p>
                    <hr>
                    <p class="mb-0">페이지를 새로고침하거나 잠시 후 다시 시도해주세요.</p>
                </div>
            `;
        }
    }

    /**
     * 데이터에서 카테고리 추출
     */
    extractCategories() {
        this.categories.clear();
        
        this.currentData.forEach(row => {
            if (row[1]) { // B열: 카테고리
                this.categories.add(row[1].trim());
            }
        });
        
        console.log('추출된 카테고리:', Array.from(this.categories));
    }

    /**
     * 탭과 콘텐츠 생성
     */
    createTabsAndContent() {
        this.createTabs();
        this.createTabContent();
        
        // 첫 번째 탭 활성화
        const firstTab = document.querySelector('#categoryTabs .nav-link');
        if (firstTab) {
            firstTab.click();
        }
    }

    /**
     * 탭 네비게이션 생성
     */
    createTabs() {
        const tabContainer = document.getElementById('categoryTabs');
        if (!tabContainer) return;

        const tabs = Array.from(this.categories).map((category, index) => {
            const tabId = `tab-${this.sanitizeId(category)}`;
            const isActive = index === 0 ? 'active' : '';
            
            return `
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${isActive}" 
                            id="${tabId}-tab" 
                            data-bs-toggle="tab" 
                            data-bs-target="#${tabId}" 
                            type="button" 
                            role="tab" 
                            aria-controls="${tabId}" 
                            aria-selected="${index === 0}">
                        ${category}
                    </button>
                </li>
            `;
        }).join('');

        tabContainer.innerHTML = tabs;
    }

    /**
     * 탭 콘텐츠 생성
     */
    createTabContent() {
        const contentContainer = document.getElementById('content-container');
        if (!contentContainer) return;

        const tabPanes = Array.from(this.categories).map((category, index) => {
            const tabId = `tab-${this.sanitizeId(category)}`;
            const isActive = index === 0 ? 'show active' : '';
            const cards = this.createCardsForCategory(category);
            
            return `
                <div class="tab-pane fade ${isActive}" 
                     id="${tabId}" 
                     role="tabpanel" 
                     aria-labelledby="${tabId}-tab">
                    <div class="row">
                        ${cards}
                    </div>
                </div>
            `;
        }).join('');

        contentContainer.innerHTML = tabPanes;
    }

    /**
     * 특정 카테고리의 카드들 생성
     */
    createCardsForCategory(category) {
        const categoryData = this.currentData.filter(row => 
            row[1] && row[1].trim() === category
        );

        return categoryData.map(row => {
            const title = row[2] || '제목 없음';  // C열: 제목
            const description = row[3] || '';     // D열: 설명
            const imageUrl = row[4] || '/resource/default-image.png'; // E열: 이미지
            const linkUrl = row[5] || '#';        // F열: 링크

            return this.createCard(title, description, imageUrl, linkUrl);
        }).join('');
    }

    /**
     * 개별 카드 HTML 생성
     */
    createCard(title, description, imageUrl, linkUrl) {
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <img src="${imageUrl}" 
                         class="card-img-top" 
                         alt="${title}"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='/resource/default-image.png'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text flex-grow-1">${description}</p>
                        <a href="${linkUrl}" 
                           class="btn btn-primary mt-auto"
                           ${linkUrl.startsWith('http') ? 'target="_blank"' : ''}>
                            시작하기
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * ID로 사용할 수 있도록 문자열 정리
     */
    sanitizeId(str) {
        return str.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();
    }
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', function() {
    const cardManager = new CardLinkManager();
    cardManager.init();
});
