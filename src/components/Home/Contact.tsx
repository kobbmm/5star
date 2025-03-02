import Image from 'next/image';

const Contact = () => {
    return (
        <div className="w-full bg-[#AB3434] py-8">
            <div className="w-full bg-white py-12">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Algemene links */}
                    <div>
                        <h2 className="text-2xl italic font-lato">Contact Us</h2>
                        <ul className="mt-4 space-y-2 text-lg font-light">
                            <li>About Us</li>
                            <li>Contact Information</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                            <li>FAQs</li>
                        </ul>
                    </div>
                {/* Samenwerken */}
                <div>
                    <h2 className="text-2xl italic font-lato">Work with Us</h2>
                        <ul className="mt-4 space-y-2 text-lg font-light">
                            <li>Become a Partner</li>
                            <li>Event Hosting</li>
                            <li>Catering Services</li>
                            <li>Join Our Team</li>
                        </ul>
                </div>
            {/* Socials */}
                <div className="flex items-center space-x-4 justify-end">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/facebook-logo.png" alt="Facebook" width={32} height={32} className="w-8 h-8" />
                    </a>
                    <a href="https://github.com/kobbmm/5star" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/github-logo.png" alt="GitHub" width={32} height={32} className="w-8 h-8" />
                    </a>
                </div>
            </div>
        </div>
        {/* Footer Copy */}
            <div className="w-full bg-white py-4 border-t border-gray-300">
                <div className="max-w-6xl mx-auto px-4 flex justify-between">
                    <span className="text-gray-600">© 2025 - Cloud & Crème Producties</span>
                </div>
            </div>
        </div>
    );
  };
  
  export default Contact;  