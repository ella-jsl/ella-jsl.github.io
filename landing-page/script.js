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
});
