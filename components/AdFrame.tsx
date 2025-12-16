import React from 'react';

const AdFrame: React.FC = () => {
  // Breaking up the closing script tag prevents the browser's parser from
  // prematurely closing the script block when this code is bundled.
  const adSrc = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '55e6e1b95ce5460f1b419525e3dbb065',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </scr` + `ipt>
      <script type="text/javascript" src="https://www.highperformanceformat.com/55e6e1b95ce5460f1b419525e3dbb065/invoke.js"></scr` + `ipt>
    </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center overflow-hidden bg-black/40 border-t border-cyan-900/30 backdrop-blur-sm min-h-[60px] relative z-50 py-1">
      <div className="origin-center scale-90 sm:scale-100 transition-transform duration-300">
        <iframe
          title="Sponsored Ad"
          srcDoc={adSrc}
          width="320"
          height="50"
          style={{ border: 'none', display: 'block' }}
          scrolling="no"
        />
      </div>
    </div>
  );
};

export default AdFrame;