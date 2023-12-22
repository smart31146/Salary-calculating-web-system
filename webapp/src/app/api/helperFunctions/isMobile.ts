export const isMobile = () => {
    // Define a media query to match mobile devices
    const isMobileQuery = window.matchMedia('(max-width: 767px)');
  
    // Check if the media query matches
    if (isMobileQuery.matches) {
      // Device is mobile
      return true;
    } else {
      // Device is not mobile (laptop or larger)
      return false;
    }
  }