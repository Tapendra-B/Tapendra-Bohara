import React, { useEffect } from 'react';

const DirectScriptAd: React.FC = () => {
  useEffect(() => {
    const scriptUrl = "//pl28229223.effectivegatecpm.com/04/28/21/042821b588549d246649361e196adf90.js";
    
    // Check if script already exists to prevent duplicates
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
        return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.type = 'text/javascript';
    
    document.body.appendChild(script);

    return () => {
       // Optional: Cleanup if component unmounts, though usually these scripts persist
       // try { document.body.removeChild(script); } catch (e) {}
    };
  }, []);

  return null;
};

export default DirectScriptAd;