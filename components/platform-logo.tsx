import React from 'react';

export function PlatformLogo({ platform, size = 'md' }: { platform: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const logos: Record<string, JSX.Element> = {
    meta: (
      <div className={`${sizes[size]} bg-blue-600 rounded-lg flex items-center justify-center`}>
        <svg className="h-2/3 w-2/3" fill="white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    ),
    google: (
      <div className={`${sizes[size]} bg-white rounded-lg flex items-center justify-center p-2`}>
        <svg viewBox="0 0 48 48" className="h-full w-full">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </div>
    ),
    shopify: (
      <div className={`${sizes[size]} bg-[#95BF47] rounded-lg flex items-center justify-center p-2`}>
        <svg className="h-full w-full" fill="white" viewBox="0 0 24 24">
          <path d="M15.337 2.368c-.038-.002-.08-.002-.118-.002-1.694 0-3.054 1.103-3.755 2.405-.513-.393-1.134-.625-1.803-.625-.081 0-.162.004-.242.011a3.98 3.98 0 0 0-.244-.008c-2.185 0-3.957 1.773-3.957 3.957 0 .219.018.435.053.646C2.724 9.47 1 11.695 1 14.326c0 3.036 2.464 5.5 5.5 5.5h11c3.036 0 5.5-2.464 5.5-5.5 0-2.631-1.724-4.856-4.271-5.574.035-.211.053-.427.053-.646 0-2.184-1.772-3.957-3.957-3.957z"/>
        </svg>
      </div>
    ),
    linkedin: (
      <div className={`${sizes[size]} bg-[#0A66C2] rounded-lg flex items-center justify-center`}>
        <svg className="h-2/3 w-2/3" fill="white" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </div>
    ),
    tiktok: (
      <div className={`${sizes[size]} bg-black rounded-lg flex items-center justify-center p-2`}>
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#00F2EA"/>
        </svg>
      </div>
    ),
  }

  return logos[platform] || <div className={sizes[size]}></div>
}
