/**
 * 고씨네 컴포트 힐 패드 랜딩 페이지 스크립트 (script.js)
 * 기능:
 * 1. CTA 클릭 시 '아직 준비 중입니다.' 안내 모달 팝업 표시
 * 2. FAQ 아코디언 토글 (열기/닫기)
 * 3. 앵커 링크 부드러운 스크롤 (헤더 오프셋 반영)
 * 4. 이미지 로딩 에러 시 '이미지 준비 중' 플레이스홀더 폴백 처리
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. CTA 버튼 모달 안내 인터랙션
  // ------------------------------------------------------------------------
  const modal = document.getElementById('status-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const ctaButtons = document.querySelectorAll('#cta-hero, #cta-final, #cta-header');

  /**
   * 모달 열기
   * @param {string} ctaSource - 버튼 위치 구분자 (hero, final, header)
   */
  function openModal(ctaSource) {
    if (!modal) return;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지

    // 접근성: 닫기 버튼으로 포커스 이동
    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  /**
   * 모달 닫기
   */
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // CTA 버튼 이벤트 바인딩 (cta-header 전용 모달 연결 유지)
  const headerCta = document.getElementById('cta-header');
  if (headerCta) {
    headerCta.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('header');
    });
  }

  // 닫기 버튼 이벤트
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // 배경 클릭 시 닫기
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // ESC 키 누를 시 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // ------------------------------------------------------------------------
  // 2. FAQ 아코디언 토글 인터랙션
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggleBtn = item.querySelector('.faq-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // 단일 열림 모드: 다른 열린 항목 닫기
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          otherItem.classList.remove('is-open');
          const otherBtn = otherItem.querySelector('.faq-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // 현재 항목 토글
      if (isOpen) {
        item.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 3. 헤더 앵커 링크 부드러운 스크롤 (헤더 높이 보정)
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.gnb-nav a, .scroll-nudge-btn, .brand-logo');
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 72;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. 이미지 로딩 에러 시 '이미지 준비 중' 플레이스홀더 폴백
  // ------------------------------------------------------------------------
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    img.addEventListener('error', () => {
      if (img.parentElement) {
        img.parentElement.classList.add('img-fallback');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. GA4 구간 도달 측정 (section_view) & 6. CTA 클릭 측정 (cta_click)
  // ------------------------------------------------------------------------
  if (!window.__ga4TrackingInitialized) {
    window.__ga4TrackingInitialized = true;

    // 안전한 gtag 래퍼 함수 (GA 미로드/차단 시에도 예외 없이 안전 처리)
    function trackEvent(eventName, params) {
      if (typeof window.gtag === 'function') {
        try {
          window.gtag('event', eventName, params);
        } catch (err) {
          // 태그 전송 실패 시에도 사용자 동작에 영향 주지 않음
        }
      }
    }

    // [1] 구간 도달 (section_view)
    const trackedSections = new Set();
    const sectionTargets = [
      { id: 'hero-title', name: 'hero' },
      { id: 'detail-space-title', name: 'detail' },
      { id: 'purchase-title', name: 'cta' }
    ];

    const headerElem = document.querySelector('.site-header');
    const headerOffset = headerElem ? headerElem.offsetHeight : 76;

    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        // 탭이 활성화되어 실제 화면에 표시될 때만 전송
        if (document.visibilityState !== 'visible') return;

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionName = entry.target.dataset.sectionName;
            if (sectionName && !trackedSections.has(sectionName)) {
              trackedSections.add(sectionName);
              trackEvent('section_view', { section_name: sectionName });
              sectionObserver.unobserve(entry.target);
            }
          }
        });
      }, {
        root: null,
        // 고정 헤더 높이만큼 상단 가림 영역 제외
        rootMargin: `-${headerOffset}px 0px 0px 0px`,
        threshold: 0.5
      });

      sectionTargets.forEach(target => {
        const el = document.getElementById(target.id);
        if (el) {
          el.dataset.sectionName = target.name;
          sectionObserver.observe(el);
        }
      });

      // 다른 탭에서 돌아왔을 때 현재 뷰포트에 있는 제목 누락 방지
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const visibleHeaderH = (headerElem ? headerElem.offsetHeight : 76);
          const viewportH = window.innerHeight;

          sectionTargets.forEach(target => {
            if (!trackedSections.has(target.name)) {
              const el = document.getElementById(target.id);
              if (el) {
                const rect = el.getBoundingClientRect();
                const visibleTop = Math.max(rect.top, visibleHeaderH);
                const visibleBottom = Math.min(rect.bottom, viewportH);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                if (rect.height > 0 && (visibleHeight / rect.height) >= 0.5) {
                  trackedSections.add(target.name);
                  trackEvent('section_view', { section_name: target.name });
                  sectionObserver.unobserve(el);
                }
              }
            }
          });
        }
      });
    }

    // [2] CTA 클릭 (cta_click)
    // 두 선택자(#cta-hero, #cta-final / data-cta-location)가 중복되지 않도록 고유 요소 집합 구성
    const ctaMap = new Map();

    const heroBtn = document.getElementById('cta-hero') || document.querySelector('[data-cta-location="hero"]');
    if (heroBtn) ctaMap.set(heroBtn, 'hero');

    const finalBtn = document.getElementById('cta-final') || document.querySelector('[data-cta-location="final"]');
    if (finalBtn) ctaMap.set(finalBtn, 'final');

    ctaMap.forEach((location, btnElement) => {
      // <a> 태그의 클릭 이벤트는 마우스 클릭 및 키보드 Enter(활성화) 모두 1회의 click 이벤트를 발생시킴
      btnElement.addEventListener('click', () => {
        trackEvent('cta_click', { button_location: location });
      });
    });
  }
});

