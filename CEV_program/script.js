document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Mobile Toggle:', mobileToggle);
    console.log('Nav Menu:', navMenu);
    console.log('Nav Links:', navLinks);

    // 모바일 메뉴 토글
    mobileToggle.addEventListener('click', function() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // 메뉴 링크 클릭시 메뉴 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // 스크롤 이벤트 처리
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
            // 스크롤 다운
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
            // 스크롤 업
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // 프로그램 탭 전환
    const programTabs = document.querySelectorAll('.program-tab');
    const programContents = document.querySelectorAll('.program-content');

    programTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 탭 활성화 상태 변경
            programTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 컨텐츠 표시/숨김
            const targetId = tab.getAttribute('data-target');
            programContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // 폼 유효성 검사
    const contactForm = document.getElementById('contactForm');
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('.form-control');
        const error = group.querySelector('.form-error');

        input.addEventListener('blur', () => {
            validateField(input, error);
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        formGroups.forEach(group => {
            const input = group.querySelector('.form-control');
            const error = group.querySelector('.form-error');
            if (!validateField(input, error)) {
                isValid = false;
            }
        });

        if (isValid) {
            // 폼 제출 처리
            const formStatus = document.getElementById('formStatus');
            formStatus.textContent = '문의가 성공적으로 전송되었습니다.';
            formStatus.style.color = 'green';
            contactForm.reset();
            
            // 3초 후 메시지 초기화
            setTimeout(() => {
                formStatus.textContent = '';
            }, 3000);
        }
    });

    // 필드 유효성 검사 함수
    function validateField(input, error) {
        const value = input.value.trim();
        let isValid = true;

        switch(input.type) {
            case 'text':
                if (value.length < 2) {
                    error.textContent = '최소 2자 이상 입력해주세요.';
                    isValid = false;
                } else {
                    error.textContent = '';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error.textContent = '유효한 이메일 주소를 입력해주세요.';
                    isValid = false;
                } else {
                    error.textContent = '';
                }
                break;
            case 'tel':
                const phoneRegex = /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/;
                if (!phoneRegex.test(value)) {
                    error.textContent = '올바른 전화번호 형식이 아닙니다.';
                    isValid = false;
                } else {
                    error.textContent = '';
                }
                break;
            case 'textarea':
                if (value.length < 10) {
                    error.textContent = '최소 10자 이상 입력해주세요.';
                    isValid = false;
                } else {
                    error.textContent = '';
                }
                break;
        }

        error.classList.toggle('visible', !isValid);
        return isValid;
    }

    // 팝업 기능
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupClose = document.querySelector('.popup-close');
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.feature-title').textContent;
            const text = card.querySelector('.feature-text').textContent;
            
            // 팝업 내용 설정
            popupOverlay.querySelector('.popup-title').textContent = title;
            popupOverlay.querySelector('.popup-description').textContent = text;
            
            // 팝업 표시
            popupOverlay.style.display = 'flex';
            setTimeout(() => {
                popupOverlay.classList.add('active');
            }, 10);
        });
    });

    popupClose.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300);
    });

    // ESC 키로 팝업 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            popupClose.click();
        }
    });

    // Program data
    const programs = {
        explorer: {
            title: '코드 익스플로러',
            subtitle: '방학 집중 코딩 캠프',
            badge: '방학특강',
            image: 'img/program-explorer.jpg',
            rating: 4.8,
            ratingCount: 156,
            duration: '여름/겨울 방학 1주일 (5일 과정, 하루 4시간)',
            target: '중고등학생',
            price: '350,000원',
            description: '블록 코딩부터 시작해 웹/앱 개발, AI 기초까지 체험하는 종합 캠프입니다. 방학 기간을 활용하여 코딩의 기초부터 심화 과정까지 체계적으로 학습할 수 있습니다.',
            curriculum: [
                '블록 코딩 기초',
                '웹 개발 입문',
                '앱 개발 기초',
                'AI 기초 학습',
                '최종 프로젝트 진행'
            ],
            features: [
                '난이도별 3단계 과정(입문/기초/심화)',
                '체계적인 커리큘럼',
                '실습 중심의 학습',
                '최종 프로젝트 발표회',
                '수료증 발급'
            ],
            includes: [
                '교육 교재 및 실습 자료',
                '개발 도구 및 소프트웨어',
                '중식 제공',
                '프로젝트 결과물',
                '수료증'
            ]
        },
        weekender: {
            title: '위켄드 코더',
            subtitle: '주말 코딩 워크숍',
            badge: '주말특강',
            image: 'img/program-weekender.jpg',
            rating: 4.7,
            ratingCount: 189,
            duration: '주말 1-2일 (하루 6시간)',
            target: '중고등학생',
            price: '120,000원',
            description: '주말을 활용하여 단일 주제에 대해 집중적으로 학습하는 워크숍입니다. 매월 다양한 주제로 진행되며, 하루 만에 실제 결과물을 만들어볼 수 있습니다.',
            curriculum: [
                '게임 개발 워크숍',
                '로봇 프로그래밍',
                '웹사이트 제작',
                'AI 챗봇 만들기'
            ],
            features: [
                '하루만에 완성하는 결과물',
                '매월 변경되는 주제',
                '실습 중심 학습',
                '소규모 그룹 운영',
                '초보자 참여 가능'
            ],
            includes: [
                '워크숍 교재',
                '실습용 장비',
                '중식 제공',
                '결과물 소스코드',
                '수료증'
            ]
        },
        school: {
            title: '스쿨 코딩 데이',
            subtitle: '학교 연계 프로그램',
            badge: '학교연계',
            image: 'img/program-school.jpg',
            rating: 4.6,
            ratingCount: 245,
            duration: '학기 중 창의적 체험활동 또는 자유학기제 연계 (1-2일)',
            target: '학교 단체 (최소 20명 이상)',
            price: '30,000원',
            description: '학교별 맞춤형 코딩 체험 활동을 제공하는 프로그램입니다. 창의적 체험활동이나 자유학기제와 연계하여 진행되며, 20명 이상 신청 시 교구 대여가 무료로 제공됩니다.',
            curriculum: [
                '블록 코딩 기초',
                '피지컬 컴퓨팅',
                '앱 인벤터 체험',
                '학교별 맞춤 프로젝트'
            ],
            features: [
                '학교 방문 진행',
                '수준별 분반 가능',
                '단체 맞춤형 커리큘럼',
                '교구 대여 무료 (20명 이상)',
                '체험형 학습'
            ],
            includes: [
                '교육 교재',
                '실습용 교구',
                '수료증',
                '단체 할인',
                '결과물 공유'
            ]
        },
        creator: {
            title: '코드 크리에이터',
            subtitle: '방과 후 코딩 클럽',
            badge: '방과후',
            image: 'img/program-creator.jpg',
            rating: 4.9,
            ratingCount: 178,
            duration: '8주 과정 (주 1회, 2시간)',
            target: '중고등학생',
            price: '480,000원',
            description: '8주 동안 단계별 프로젝트를 통해 코딩을 배우는 방과 후 프로그램입니다. 소규모 그룹으로 운영되며, 개인별 멘토링을 통해 체계적인 학습을 지원합니다.',
            curriculum: [
                '게임 개발 트랙',
                '웹/앱 개발 트랙',
                'AI/데이터 분석 트랙',
                '개인 프로젝트 진행'
            ],
            features: [
                '소규모 그룹(최대 12명)',
                '멘토링 제공',
                '단계별 학습',
                '트랙별 전문 교육',
                '프로젝트 중심 학습'
            ],
            includes: [
                '교육 교재',
                '온라인 학습 자료',
                '개인별 멘토링',
                '프로젝트 피드백',
                '수료증'
            ]
        },
        battle: {
            title: '코드 배틀',
            subtitle: '해커톤 챌린지',
            badge: '해커톤',
            image: 'img/program-battle.jpg',
            rating: 4.9,
            ratingCount: 134,
            duration: '1박 2일 집중 프로그램',
            target: '코딩 경험이 있는 중고등학생',
            price: '200,000원',
            description: '1박 2일 동안 진행되는 집중 해커톤 프로그램입니다. 팀을 이루어 실제 문제를 해결하는 프로젝트를 진행하며, 전문가의 멘토링과 우수팀 시상이 제공됩니다.',
            curriculum: [
                '사회문제 해결을 위한 앱 개발',
                '게임 개발 챌린지',
                'AI 솔루션 개발',
                '팀 프로젝트 발표'
            ],
            features: [
                '팀 기반 경쟁',
                '전문가 멘토링',
                '우수팀 시상',
                '실전 문제 해결',
                '네트워킹 기회'
            ],
            includes: [
                '숙박 및 식사',
                '개발 환경 제공',
                '전문가 멘토링',
                '시상품',
                '참가 인증서'
            ]
        }
    };

    // Load program detail
    function loadProgramDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const programId = urlParams.get('id');
        
        if (!programId || !programs[programId]) {
            window.location.href = 'course.html';
            return;
        }
        
        const program = programs[programId];
        
        // Update page title
        document.title = `${program.title} - ${program.subtitle} | 코스모에듀벤처`;
        
        // Update program image and badge
        const programImage = document.getElementById('programImage');
        programImage.src = program.image;
        programImage.alt = program.title;
        document.getElementById('programBadge').textContent = program.badge;
        
        // Update program title and subtitle
        const titleElement = document.getElementById('programTitle');
        titleElement.textContent = program.title;
        const subtitleElement = document.createElement('div');
        subtitleElement.className = 'program-subtitle';
        subtitleElement.textContent = program.subtitle;
        titleElement.appendChild(subtitleElement);
        
        // Update program meta information
        const ratingHtml = `
            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(program.rating))}
            ${program.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
            <span>${program.rating}</span>
            <span>(${program.ratingCount})</span>
        `;
        document.getElementById('programRating').innerHTML = ratingHtml;
        
        // Update duration and target
        document.getElementById('programDuration').innerHTML = `
            <i class="far fa-clock"></i>
            <span>${program.duration}</span>
        `;
        
        // Update target audience
        document.getElementById('programTarget').innerHTML = `
            <i class="fas fa-users"></i>
            <span>${program.target}</span>
        `;
        
        // Update price
        document.getElementById('programPrice').textContent = program.price;
        
        // Update description
        document.getElementById('programDescription').textContent = program.description;
        
        // Update lists
        function updateList(id, items) {
            const list = document.getElementById(id);
            if (list) {
                list.innerHTML = '';
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                });
            }
        }
        
        updateList('programCurriculum', program.curriculum);
        updateList('programFeatures', program.features);
        updateList('programIncludes', program.includes);
    }

    // Initialize program detail page if on program detail page
    if (window.location.pathname.includes('program-detail.html')) {
        loadProgramDetail();
    }
}); 