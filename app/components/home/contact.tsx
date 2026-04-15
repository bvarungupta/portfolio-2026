import React from 'react';
import Link from 'next/link';
import Image from 'next/image'
import GridDivider from '../ui/GridDivider'

const Contact = () => {
  return (
    <>
      <GridDivider />
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Main Container with Grid Lines */}
        <div className="max-w-6xl mx-auto md:rounded-lg border border-gray-300 h-full">

          {/* Ready to Collab Section */}
          <div className="rounded-none md:rounded-b-lg">
            {/* Content Layout */}
            <div className="px-6 md:px-12 py-8 md:py-12">
              {/* Two Column Layout - Mobile: single column, Desktop: two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                {/* Left Column - Text Content */}
                <div className="order-1 md:order-none">
                  <h2 className="text-4xl md:text-6xl font-light mb-6 md:mb-8 text-center md:text-left" style={{ fontFamily: 'Garamond, Georgia, serif' }}>
                    Ready to Collab?
                  </h2>

                  <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed text-center md:text-left" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                      Currently working at Abhiyantrik Solutions.
                    </p>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed text-center md:text-left" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                      Always open to exciting projects, collaborations, and connecting with creative minds.
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-500 flex-shrink-0"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <p className="text-black text-base md:text-lg font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                        bvarungupta@gmail.com
                      </p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-500 flex-shrink-0"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <p className="text-black text-base md:text-lg font-medium" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                        +91 8722519704
                      </p>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-lg md:text-xl font-regular text-zinc-00 mb-4 md:mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                      Follow Me
                    </h3>
                    <div className="flex gap-4 justify-center md:justify-start">
                      <Link href="https://www.instagram.com/sat_dez" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                        <Image src="/images/HomeImages/social/instagram.svg" alt="Instagram" width={40} height={40} className="w-10 h-10 md:w-12 md:h-12" />
                      </Link>
                      <Link href="https://linkedin.com/in/bvarungupta" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                        <Image src="/images/HomeImages/social/linkedin.svg" alt="LinkedIn" width={40} height={40} className="w-10 h-10 md:w-12 md:h-12" />
                      </Link>
                      <Link href="https://behance.net/bvarungupta" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                        <Image src="/images/HomeImages/social/behance.svg" alt="Behance" width={40} height={40} className="w-10 h-10 md:w-12 md:h-12" />
                      </Link>
                      <Link href="https://dribbble.com/bvarungupta" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors duration-200">
                        <Image src="/images/HomeImages/social/dribbble.svg" alt="Dribbble" width={40} height={40} className="w-10 h-10 md:w-12 md:h-12" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column - Logo */}
                <div className="flex items-center justify-center order-0 md:order-none">
                  <Image
                    src="/images/HomeImages/sa-flower-logo.png"
                    alt="SA Flower Logo"
                    width={250}
                    height={250}
                    className="w-60 h-60 md:w-80 md:h-80 object-contain"
                  />
                </div>
              </div>

              {/* Bottom Message */}
              <div className="mt-12 md:mt-16 pt-6 md:pt-8 text-center">
                <p className="text-gray-400 text-sm md:text-md" style={{ fontFamily: 'Garamond, Georgia, serif' }}>
                  Let&apos;s create something amazing together !
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;
